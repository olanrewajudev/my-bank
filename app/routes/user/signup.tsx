import { BiLock, BiPhone } from "react-icons/bi";

import {
    IoChevronDownSharp,
    IoChevronForward,
    IoAddCircleOutline,
    IoInformationCircleOutline,
    IoEyeOutline,
    IoEyeOffOutline,
} from "react-icons/io5";

import { Link, useNavigate } from "react-router";

import formatPhone, { FAQs } from "~/component/general/constant";

import UserFooter from "~/component/user/footer";

import {
    EMPLOYMENT_STATUSES,
    ErrorAlert,
    HotAlert,
    US_STATES,
} from "~/component/utils";

import { User_urls } from "~/component/endpoints/user";

import { CookieName } from "~/component/Apis";

import Cookies from "js-cookie";

import { dispatchToken } from "~/lib/reducer";

import type { PersonalInfo, VerifyIdentity } from "../../../global";

import { useDispatch } from "react-redux";

import React, { useEffect, useState } from "react";

const SIGNUP_STEPS = [
    "Get started",
    "Personal info",
    "Verify identity",
    "Open account",
];

// Helper: returns the border classes for a required field based on whether it's empty
function reqBorder(value: string) {
    return value.trim() === ""
        ? "border-red-500"
        : "border-slate-300";
}

export default function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [active, setActive] = useState(0);
    const [step, setStep] = useState(0);

    const [accountType, setAccountType] = useState(
        "Online Savings Account"
    );

    const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
        firstName: "",
        mi: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        pin: "",
        confirmPin: "",
        agreed: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [verifyIdentity, setVerifyIdentity] =
        useState<VerifyIdentity>({
            primaryAddress: "",
            aptSuite: "",
            city: "",
            state: "",
            zip: "",
            countryOfCitizenship: "United States",
            alternatePhone: "",
            dob: "",

            // SSN temporarily disabled
            ssn: "",
            confirmSsn: "",

            employmentStatus: "",
        });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleActive(value: number) {
        if (active !== value) {
            return setActive(value);
        }

        return setActive(0);
    }

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [step]);

    function updatePersonalInfo<K extends keyof PersonalInfo>(
        key: K,
        value: PersonalInfo[K]
    ) {
        setPersonalInfo((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    function updateVerifyIdentity<K extends keyof VerifyIdentity>(
        key: K,
        value: VerifyIdentity[K]
    ) {
        setVerifyIdentity((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    function formatDOB(value: string) {
        const digits = value
            .replace(/\D/g, "")
            .slice(0, 8);

        const parts = [
            digits.slice(0, 2),
            digits.slice(2, 4),
            digits.slice(4, 8),
        ];

        return parts.filter(Boolean).join("/");
    }

    // SSN formatter disabled
    /*
    function formatSSN(value: string) {
        const digits = value.replace(/\D/g, "").slice(0, 9);

        const parts = [
            digits.slice(0, 3),
            digits.slice(3, 5),
            digits.slice(5, 9),
        ];

        return parts.filter(Boolean).join("-");
    }
    */

    function toApiDob(mmddyyyy: string) {
        // form stores "MM/DD/YYYY", API wants "YYYY-MM-DD"
        const [mm, dd, yyyy] = mmddyyyy.split("/");

        return `${yyyy}-${mm}-${dd}`;
    }

    const passwordValid =
        personalInfo.password.length >= 8 &&
        /[A-Za-z]/.test(personalInfo.password) &&
        /\d/.test(personalInfo.password);

    const pinValid = /^\d{4}$/.test(personalInfo.pin);

    /*
     * STEP 1 VALIDATION
     *
     * MI is now REQUIRED.
     */
    const personalInfoValid =
        personalInfo.firstName.trim() !== "" &&
        personalInfo.mi.trim() !== "" &&
        personalInfo.lastName.trim() !== "" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            personalInfo.email
        ) &&
        personalInfo.phone.replace(/\D/g, "").length >= 10 &&
        passwordValid &&
        personalInfo.password ===
            personalInfo.confirmPassword &&
        pinValid &&
        personalInfo.pin === personalInfo.confirmPin &&
        personalInfo.agreed;

    const isUSCitizen =
        verifyIdentity.countryOfCitizenship ===
        "United States";

    /*
     * STEP 2 VALIDATION
     *
     * ZIP is REQUIRED but does NOT have to be exactly
     * 5 digits.
     *
     * Examples:
     * 1234     ✅
     * 12345    ✅
     * 123456   ✅
     * 1234567  ✅
     *
     * Empty     ❌
     * 123AB     ❌
     */
    const verifyIdentityValid =
        verifyIdentity.primaryAddress.trim() !== "" &&
        verifyIdentity.city.trim() !== "" &&
        verifyIdentity.state.trim() !== "" &&
        /^\d+$/.test(verifyIdentity.zip) &&
        verifyIdentity.countryOfCitizenship.trim() !== "" &&
        /^\d{2}\/\d{2}\/\d{4}$/.test(
            verifyIdentity.dob
        ) &&
        verifyIdentity.employmentStatus.trim() !== "";

    function goToStep(index: number) {
        setStep(
            Math.max(
                0,
                Math.min(
                    index,
                    SIGNUP_STEPS.length - 1
                )
            )
        );
    }

    /*
     * FINAL SUBMISSION
     *
     * Validation is performed AGAIN here.
     *
     * This guarantees that the API request will NOT be
     * sent if required fields are missing or invalid.
     */
    const handleSubmission = async () => {
        setError("");

        // Prevent submission if Personal Information is invalid
        if (!personalInfoValid) {
            setError(
                "Please complete all required personal information fields."
            );
            return;
        }

        // Prevent submission if Identity Information is invalid
        if (!verifyIdentityValid) {
            setError(
                "Please complete all required identity information fields."
            );
            return;
        }

        setLoading(true);

        try {
            const payload = {
                firstname:
                    personalInfo.firstName.trim(),

                lastname:
                    personalInfo.lastName.trim(),

                // MI is now required
                mi: personalInfo.mi.trim(),

                phone: personalInfo.phone.replace(
                    /\D/g,
                    ""
                ),

                email:
                    personalInfo.email.trim(),

                password:
                    personalInfo.password,

                confirm_password:
                    personalInfo.confirmPassword,

                agreed:
                    personalInfo.agreed,

                accounttype:
                    accountType
                        .toLowerCase()
                        .includes("savings")
                        ? "personal"
                        : accountType.toLowerCase(),

                address:
                    verifyIdentity.primaryAddress.trim(),

                city:
                    verifyIdentity.city.trim(),

                state:
                    verifyIdentity.state.trim(),

                // ZIP can be any number of digits
                zipcode:
                    verifyIdentity.zip,

                dob: toApiDob(
                    verifyIdentity.dob
                ),

                pin:
                    personalInfo.pin,

                // SSN temporarily disabled
                // ...(isUSCitizen
                //     ? {
                //           ssn: verifyIdentity.ssn.replace(/\D/g, ""),
                //       }
                //     : {}),
            };

            const res =
                await User_urls.register(payload);

            if (res.status === 200) {
                if (res.data?.token) {
                    Cookies.set(
                        CookieName,
                        res.data.token
                    );

                    dispatch(
                        dispatchToken(
                            res.data.token
                        )
                    );

                    navigate(
                        "/user/dashboard"
                    );

                    HotAlert(res.data.msg);
                }
            } else {
                ErrorAlert(res.data.msg);
            }
        } catch (err: any) {
            setError(
                err.message ||
                    "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <div>
                <nav className="border-b border-gray-200">
                    <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-8">
                        <Link to="/">
                            <img
                                src="/logo-dark.png"
                                alt=""
                                className="size-32 object-contain"
                            />
                        </Link>

                        <div className="flex items-center gap-8 text-[#143B63]">
                            <Link
                                to="/login"
                                className="flex items-center gap-2 text-sm"
                            >
                                <BiLock className="h-5 w-5" />
                                Login
                            </Link>
                        </div>
                    </div>
                </nav>
            </div>

            {/* FDIC */}
            <div className="py-5">
                <div className="mx-auto flex max-w-7xl items-center justify-center gap-1 px-8">
                    <h2 className="text-2xl font-extrabold text-[#143B63]">
                        FDIC
                    </h2>

                    <p className="text-xs italic text-slate-700">
                        FDIC-Insured - Backed by the full
                        faith and credit of the U.S. Government.
                        Beacon Gold Crest Bank USA, Salt Lake
                        City Branch.
                    </p>
                </div>
            </div>

            {/* Step Indicator */}
            <section className="mx-auto max-w-3xl pt-12 lg:px-20">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {SIGNUP_STEPS.map(
                        (label, index) => {
                            const isDone =
                                index < step;

                            const isCurrent =
                                index === step;

                            return (
                                <React.Fragment
                                    key={label}
                                >
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <span
                                            className={`text-sm ${
                                                isDone ||
                                                isCurrent
                                                    ? "text-[#2f9e6f]"
                                                    : "text-slate-400"
                                            }`}
                                        >
                                            {label}
                                        </span>

                                        <button
                                            onClick={() =>
                                                index <
                                                    step &&
                                                goToStep(
                                                    index
                                                )
                                            }
                                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${
                                                isDone
                                                    ? "border-[#2f9e6f] bg-[#2f9e6f]"
                                                    : isCurrent
                                                      ? "border-[#2f9e6f] bg-[#2f9e6f]"
                                                      : "border-slate-300 bg-white"
                                            }`}
                                        >
                                            {isDone && (
                                                <span className="text-[10px] leading-none text-white">
                                                    ✓
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </React.Fragment>
                            );
                        }
                    )}
                </div>
            </section>

            <section className="mx-auto py-5 lg:w-[55%]">
                <section className="mx-auto max-w-3xl px-8 py-10 lg:py-20">

                    {/* STEP 0 */}
                    {step === 0 && (
                        <div>
                            <h1 className="text-3xl font-light text-[#101d3d] lg:text-5xl">
                                Let's get started
                            </h1>

                            <p className="mt-2 text-sm text-[#101d3d] lg:text-base">
                                Already a customer? Please{" "}
                                <Link
                                    to="/login"
                                    className="text-[#09ab75] underline underline-offset-4"
                                >
                                    log in.
                                </Link>{" "}
                                We'll pre-fill your info to
                                save time.
                            </p>

                            <label className="mt-6 block text-base text-[#101d3d]">
                                Account type{" "}
                                <span className="text-red-500">
                                    *
                                </span>
                            </label>

                            <div className="relative mt-3">
                                <select
                                    value={accountType}
                                    onChange={(e) =>
                                        setAccountType(
                                            e.target.value
                                        )
                                    }
                                    className="w-full appearance-none rounded-sm border border-slate-300 px-6 py-3 text-base text-[#101d3d] outline-none"
                                >
                                    <option>
                                        Online Savings Account
                                    </option>

                                    <option>
                                        Certificate of Deposit
                                    </option>

                                    <option>
                                        High-Yield CD
                                    </option>
                                </select>

                                <IoChevronDownSharp className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#09ab75]" />
                            </div>

                            <p className="mt-4 text-sm text-[#101d3d]">
                                No minimum balance required. No
                                fees.
                            </p>

                            <p className="mt-6 text-sm leading-relaxed text-slate-700">
                                Annual Percentage Yield (APY) is
                                3.40% with an interest rate of
                                3.34% as of July 23, 2026.
                                Interest rate and APY are variable
                                and may change at our discretion
                                at any time without notice. For
                                more information regarding
                                interest rate calculation, please
                                refer to our{" "}
                                <Link
                                    to="/terms"
                                    className="text-[#09ab75] underline underline-offset-4"
                                >
                                    Deposit Account Agreement.
                                </Link>
                            </p>

                            <div className="mt-10 border-t border-slate-200" />
                            <div className="mt-10 border-t border-slate-200" />

                            <button
                                onClick={() =>
                                    goToStep(1)
                                }
                                className="mt-12 rounded-sm bg-[#09ab75] px-12 py-4 text-lg text-white transition hover:opacity-90"
                            >
                                Continue
                            </button>
                        </div>
                    )}

                    {/* STEP 1 */}
                    {step === 1 && (
                        <div>
                            <h1 className="text-2xl text-[#101d3d] lg:text-4xl">
                                Personal Information
                            </h1>

                            <p className="mt-4 text-slate-700 lg:text-lg">
                                This should be your legal full
                                name as it appears on your
                                government ID
                            </p>

                            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                                {/* FIRST NAME */}
                                <div>
                                    <label className="mb-2 block text-base text-[#101d3d]">
                                        First name{" "}
                                        <span className="text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="First name"
                                        value={
                                            personalInfo.firstName
                                        }
                                        onChange={(e) =>
                                            updatePersonalInfo(
                                                "firstName",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full rounded-sm border ${reqBorder(
                                            personalInfo.firstName
                                        )} px-4 py-4 text-lg text-[#101d3d] outline-none`}
                                    />
                                </div>

                                {/* MI - REQUIRED */}
                                <div>
                                    <label className="mb-2 block text-base text-[#101d3d]">
                                        MI{" "}
                                        <span className="text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="MI"
                                        maxLength={1}
                                        value={
                                            personalInfo.mi
                                        }
                                        onChange={(e) =>
                                            updatePersonalInfo(
                                                "mi",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full rounded-sm border ${reqBorder(
                                            personalInfo.mi
                                        )} px-4 py-4 text-lg text-[#101d3d] outline-none`}
                                    />
                                </div>

                                {/* LAST NAME */}
                                <div>
                                    <label className="mb-2 block text-base text-[#101d3d]">
                                        Last name{" "}
                                        <span className="text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Last name"
                                        value={
                                            personalInfo.lastName
                                        }
                                        onChange={(e) =>
                                            updatePersonalInfo(
                                                "lastName",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full rounded-sm border ${reqBorder(
                                            personalInfo.lastName
                                        )} px-4 py-4 text-lg text-[#101d3d] outline-none`}
                                    />
                                </div>
                            </div>

                            {/* EMAIL */}
                            <label className="mt-10 mb-2 flex items-center gap-2 text-base text-[#101d3d]">
                                Email address{" "}
                                <span className="text-red-500">
                                    *
                                </span>
                            </label>

                            <input
                                type="email"
                                placeholder="email@address.com"
                                value={
                                    personalInfo.email
                                }
                                onChange={(e) =>
                                    updatePersonalInfo(
                                        "email",
                                        e.target.value
                                    )
                                }
                                className={`w-full rounded-sm border ${reqBorder(
                                    personalInfo.email
                                )} px-4 py-4 text-lg text-[#101d3d] outline-none`}
                            />

                            {/* PHONE */}
                            <label className="mt-10 mb-2 block text-base text-[#101d3d]">
                                Phone number{" "}
                                <span className="text-red-500">
                                    *
                                </span>
                            </label>

                            <input
                                type="tel"
                                placeholder="(###) ###-####"
                                value={
                                    personalInfo.phone
                                }
                                onChange={(e) =>
                                    updatePersonalInfo(
                                        "phone",
                                        formatPhone(
                                            e.target.value
                                        )
                                    )
                                }
                                className={`w-full rounded-sm border ${reqBorder(
                                    personalInfo.phone
                                )} px-4 py-4 text-lg text-[#101d3d] outline-none`}
                            />

                            {/* PASSWORD */}
                            <label className="mt-10 mb-2 block text-base text-[#101d3d]">
                                Password{" "}
                                <span className="text-red-500">
                                    *
                                </span>
                            </label>

                            <div className="relative">
                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Create a password"
                                    value={
                                        personalInfo.password
                                    }
                                    onChange={(e) =>
                                        updatePersonalInfo(
                                            "password",
                                            e.target.value
                                        )
                                    }
                                    className={`w-full rounded-sm border ${reqBorder(
                                        personalInfo.password
                                    )} px-4 py-4 pr-14 text-lg text-[#101d3d] outline-none placeholder:text-slate-400`}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (prev) =>
                                                !prev
                                        )
                                    }
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <IoEyeOffOutline className="h-5 w-5" />
                                    ) : (
                                        <IoEyeOutline className="h-5 w-5" />
                                    )}
                                </button>
                            </div>

                            <p className="mt-2 text-sm text-slate-600">
                                Must be at least 8 characters
                                and include a letter and a
                                number.
                            </p>

                            {/* CONFIRM PASSWORD */}
                            <label className="mt-8 mb-2 block text-base text-[#101d3d]">
                                Confirm password{" "}
                                <span className="text-red-500">
                                    *
                                </span>
                            </label>

                            <div className="relative">
                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Re-enter your password"
                                    value={
                                        personalInfo.confirmPassword
                                    }
                                    onChange={(e) =>
                                        updatePersonalInfo(
                                            "confirmPassword",
                                            e.target.value
                                        )
                                    }
                                    className={`w-full rounded-sm border ${
                                        personalInfo.confirmPassword.trim() !==
                                            "" &&
                                        personalInfo.confirmPassword !==
                                            personalInfo.password
                                            ? "border-red-500"
                                            : reqBorder(
                                                  personalInfo.confirmPassword
                                              )
                                    } px-4 py-4 pr-14 text-lg text-[#101d3d] outline-none placeholder:text-slate-400`}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (prev) =>
                                                !prev
                                        )
                                    }
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500"
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <IoEyeOffOutline className="h-5 w-5" />
                                    ) : (
                                        <IoEyeOutline className="h-5 w-5" />
                                    )}
                                </button>
                            </div>

                            {personalInfo.confirmPassword !==
                                "" &&
                                personalInfo.password !==
                                    personalInfo.confirmPassword && (
                                    <p className="mt-2 text-sm text-red-600">
                                        Passwords don't match.
                                    </p>
                                )}

                            {/* TRANSACTION PIN */}
                            <label className="mt-8 mb-2 block text-base text-[#101d3d]">
                                Transaction PIN{" "}
                                <span className="text-red-500">
                                    *
                                </span>
                            </label>

                            <input
                                type="password"
                                inputMode="numeric"
                                maxLength={4}
                                placeholder="Enter 4-digit PIN"
                                value={
                                    personalInfo.pin
                                }
                                onChange={(e) =>
                                    updatePersonalInfo(
                                        "pin",
                                        e.target.value
                                            .replace(
                                                /\D/g,
                                                ""
                                            )
                                            .slice(
                                                0,
                                                4
                                            )
                                    )
                                }
                                className={`w-full rounded-sm border ${
                                    personalInfo.pin !== "" &&
                                    !pinValid
                                        ? "border-red-500"
                                        : reqBorder(
                                              personalInfo.pin
                                          )
                                } px-4 py-4 text-lg text-[#101d3d] outline-none`}
                            />

                            {/* CONFIRM PIN */}
                            <label className="mt-6 mb-2 block text-base text-[#101d3d]">
                                Confirm Transaction PIN{" "}
                                <span className="text-red-500">
                                    *
                                </span>
                            </label>

                            <input
                                type="password"
                                inputMode="numeric"
                                maxLength={4}
                                placeholder="Re-enter your PIN"
                                value={
                                    personalInfo.confirmPin
                                }
                                onChange={(e) =>
                                    updatePersonalInfo(
                                        "confirmPin",
                                        e.target.value
                                            .replace(
                                                /\D/g,
                                                ""
                                            )
                                            .slice(
                                                0,
                                                4
                                            )
                                    )
                                }
                                className={`w-full rounded-sm border ${
                                    personalInfo.confirmPin !==
                                        "" &&
                                    personalInfo.confirmPin !==
                                        personalInfo.pin
                                        ? "border-red-500"
                                        : reqBorder(
                                              personalInfo.confirmPin
                                          )
                                } px-4 py-4 text-lg text-[#101d3d] outline-none`}
                            />

                            {personalInfo.confirmPin !==
                                "" &&
                                personalInfo.pin !==
                                    personalInfo.confirmPin && (
                                    <p className="mt-2 text-sm text-red-600">
                                        PINs don't match.
                                    </p>
                                )}

                            {/* AGREEMENT */}
                            <label
                                className={`mt-10 flex items-start gap-4 rounded-sm ${
                                    !personalInfo.agreed
                                        ? "m-[-8px] outline outline-1 outline-red-500 p-2"
                                        : ""
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={
                                        personalInfo.agreed
                                    }
                                    onChange={(e) =>
                                        updatePersonalInfo(
                                            "agreed",
                                            e.target.checked
                                        )
                                    }
                                    className="mt-1 h-5 w-5 accent-blue"
                                />

                                <span className="leading-relaxed text-[#101d3d] lg:text-lg">
                                    By checking this box, you
                                    agree to and acknowledge
                                    the receipt of: (i){" "}
                                    <Link
                                        to="/esign"
                                        className="text-[#09ab75] underline underline-offset-4"
                                    >
                                        eSign Agreement
                                    </Link>{" "}
                                    to receive documents from
                                    us electronically; and (ii)
                                    Our{" "}
                                    <Link
                                        to="/privacy"
                                        className="text-[#09ab75] underline underline-offset-4"
                                    >
                                        Privacy Policy
                                    </Link>
                                    ,{" "}
                                    <Link
                                        to="/privacy-notice"
                                        className="text-[#09ab75] underline underline-offset-4"
                                    >
                                        Privacy Notice
                                    </Link>{" "}
                                    and{" "}
                                    <Link
                                        to="/terms"
                                        className="text-[#09ab75] underline underline-offset-4"
                                    >
                                        Site Terms
                                    </Link>

                                    <span className="text-red-500">
                                        {" "}
                                        *
                                    </span>
                                </span>
                            </label>

                            {/* STEP 1 CONTINUE */}
                            <button
                                onClick={() =>
                                    personalInfoValid &&
                                    goToStep(2)
                                }
                                disabled={
                                    !personalInfoValid
                                }
                                className={`mt-10 rounded-sm px-14 py-4 text-lg text-white transition ${
                                    personalInfoValid
                                        ? "bg-[#09ab75] hover:opacity-90"
                                        : "cursor-not-allowed bg-slate-300"
                                }`}
                            >
                                Continue
                            </button>

                            <p className="mt-6 flex items-center gap-2 text-sm text-slate-600">
                                <BiLock className="h-4 w-4" />
                                Your information is protected
                                with 128-bit SSL encryption.
                            </p>
                        </div>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <div>
                            <h1 className="text-3xl font-light text-[#101d3d] lg:text-5xl">
                                Tell us about yourself
                            </h1>

                            <p className="mt-4 lg:text-lg">
                                <a
                                    href="#"
                                    className="text-[#09ab75] underline underline-offset-4"
                                >
                                    Learn how we keep your data
                                    secure.
                                </a>
                            </p>

                            {/* Residential address */}
                            <div className="mt-12">
                                <h2 className="flex items-center gap-2 text-2xl text-[#101d3d]">
                                    Residential address
                                    <IoInformationCircleOutline className="h-5 w-5 text-[#09ab75]" />
                                </h2>

                                <p className="mt-3 text-base leading-relaxed text-[#101d3d]">
                                    Enter your home address. It
                                    cannot be a PO box or
                                    business address.
                                </p>

                                <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                                    {/* PRIMARY ADDRESS */}
                                    <div>
                                        <label className="mb-2 block text-base text-[#101d3d]">
                                            Primary address{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>

                                        <textarea
                                            rows={2}
                                            value={
                                                verifyIdentity.primaryAddress
                                            }
                                            onChange={(e) =>
                                                updateVerifyIdentity(
                                                    "primaryAddress",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full resize-none rounded-sm border ${reqBorder(
                                                verifyIdentity.primaryAddress
                                            )} px-4 py-4 text-lg text-[#101d3d] outline-none`}
                                        />
                                    </div>

                                    {/* APT/SUITE */}
                                    <div>
                                        <label className="mb-2 block text-base text-[#101d3d]">
                                            Apt/Suite (optional)
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Optional"
                                            value={
                                                verifyIdentity.aptSuite
                                            }
                                            onChange={(e) =>
                                                updateVerifyIdentity(
                                                    "aptSuite",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-sm border border-slate-300 px-4 py-4 text-lg text-[#101d3d] outline-none placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                {/* CITY */}
                                <label className="mt-6 mb-2 block text-base text-[#101d3d]">
                                    City{" "}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    value={
                                        verifyIdentity.city
                                    }
                                    onChange={(e) =>
                                        updateVerifyIdentity(
                                            "city",
                                            e.target.value
                                        )
                                    }
                                    className={`w-full rounded-sm border ${reqBorder(
                                        verifyIdentity.city
                                    )} px-4 py-4 text-lg text-[#101d3d] outline-none`}
                                />

                                <div className="mt-6 grid grid-cols-2 gap-6">

                                    {/* STATE */}
                                    <div>
                                        <label className="mb-2 block text-base text-[#101d3d]">
                                            State{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>

                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={
                                                    verifyIdentity.state
                                                }
                                                onChange={(e) =>
                                                    updateVerifyIdentity(
                                                        "state",
                                                        e.target.value
                                                    )
                                                }
                                                className={`w-full rounded-sm border ${reqBorder(
                                                    verifyIdentity.state
                                                )} px-4 py-4 text-lg text-[#101d3d] outline-none`}
                                            />
                                        </div>
                                    </div>

                                    {/* ZIP */}
                                    <div>
                                        <label className="mb-2 block text-base text-[#101d3d]">
                                            ZIP code{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={
                                                verifyIdentity.zip
                                            }
                                            onChange={(e) =>
                                                updateVerifyIdentity(
                                                    "zip",
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        ""
                                                    )
                                                )
                                            }
                                            className={`w-full rounded-sm border ${
                                                verifyIdentity.zip.trim() !==
                                                    "" &&
                                                !/^\d+$/.test(
                                                    verifyIdentity.zip
                                                )
                                                    ? "border-red-500"
                                                    : reqBorder(
                                                          verifyIdentity.zip
                                                      )
                                            } px-4 py-4 text-lg text-[#101d3d] outline-none`}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 border-t border-slate-200" />

                            {/* Identity */}
                            <div className="mt-12">
                                <h2 className="text-2xl text-[#101d3d]">
                                    Identity
                                </h2>

                                <p className="mt-3 text-base leading-relaxed text-[#101d3d]">
                                    We ask this information as part
                                    of our legal requirement to
                                    know our customers.
                                </p>

                                {/* COUNTRY */}
                                <label className="mt-6 flex items-center gap-2 text-base text-[#101d3d]">
                                    Country of citizenship{" "}
                                    <span className="text-red-500">
                                        *
                                    </span>

                                    <IoInformationCircleOutline className="h-4 w-4 text-[#09ab75]" />
                                </label>

                                <div className="relative">
                                    <select
                                        value={
                                            verifyIdentity.countryOfCitizenship
                                        }
                                        onChange={(e) =>
                                            updateVerifyIdentity(
                                                "countryOfCitizenship",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full appearance-none rounded-sm border ${reqBorder(
                                            verifyIdentity.countryOfCitizenship
                                        )} px-4 py-4 text-lg text-[#09ab75] outline-none`}
                                    >
                                        <option>
                                            United States
                                        </option>

                                        <option>
                                            Canada
                                        </option>

                                        <option>
                                            Other
                                        </option>
                                    </select>

                                    <IoChevronDownSharp className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#09ab75]" />
                                </div>

                                {/*
                                SSN fields temporarily disabled.

                                {isUSCitizen && (
                                    <>
                                        <label className="mt-6 mb-2 flex items-center gap-2 text-base text-[#101d3d]">
                                            Social Security Number
                                            <span className="text-red-500">*</span>
                                            <IoInformationCircleOutline className="h-4 w-4 text-[#09ab75]" />
                                        </label>

                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="###-##-####"
                                            value={verifyIdentity.ssn}
                                            onChange={(e) =>
                                                updateVerifyIdentity(
                                                    "ssn",
                                                    formatSSN(e.target.value)
                                                )
                                            }
                                            className={`w-full rounded-sm border ${
                                                verifyIdentity.ssn.trim() !==
                                                    "" &&
                                                !/^\d{3}-\d{2}-\d{4}$/.test(
                                                    verifyIdentity.ssn
                                                )
                                                    ? "border-red-500"
                                                    : reqBorder(
                                                          verifyIdentity.ssn
                                                      )
                                            } px-4 py-4 text-lg text-[#101d3d] outline-none placeholder:text-slate-400`}
                                        />

                                        <label className="mt-6 mb-2 block text-base text-[#101d3d]">
                                            Confirm SSN
                                            <span className="text-red-500">*</span>
                                        </label>

                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="###-##-####"
                                            value={verifyIdentity.confirmSsn}
                                            onChange={(e) =>
                                                updateVerifyIdentity(
                                                    "confirmSsn",
                                                    formatSSN(e.target.value)
                                                )
                                            }
                                            className={`w-full rounded-sm border ${
                                                verifyIdentity.confirmSsn.trim() !==
                                                    "" &&
                                                verifyIdentity.confirmSsn !==
                                                    verifyIdentity.ssn
                                                    ? "border-red-500"
                                                    : reqBorder(
                                                          verifyIdentity.confirmSsn
                                                      )
                                            } px-4 py-4 text-lg text-[#101d3d] outline-none placeholder:text-slate-400`}
                                        />

                                        {verifyIdentity.confirmSsn !== "" &&
                                            verifyIdentity.confirmSsn !==
                                                verifyIdentity.ssn && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    SSNs don't match.
                                                </p>
                                            )}
                                    </>
                                )}
                                */}

                                {/* ALTERNATE PHONE */}
                                <label className="mt-6 mb-2 block text-base text-[#101d3d]">
                                    Alternate phone number
                                    (optional)
                                </label>

                                <input
                                    type="tel"
                                    placeholder="(###) ###-#### (Optional)"
                                    value={
                                        verifyIdentity.alternatePhone
                                    }
                                    onChange={(e) =>
                                        updateVerifyIdentity(
                                            "alternatePhone",
                                            formatPhone(
                                                e.target.value
                                            )
                                        )
                                    }
                                    className="w-full rounded-sm border border-slate-300 px-4 py-4 text-lg text-[#101d3d] outline-none placeholder:text-slate-400"
                                />

                                {/* DOB */}
                                <label className="mt-6 mb-2 block text-base text-[#101d3d]">
                                    Date of birth{" "}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="MM/DD/YYYY"
                                    value={
                                        verifyIdentity.dob
                                    }
                                    onChange={(e) =>
                                        updateVerifyIdentity(
                                            "dob",
                                            formatDOB(
                                                e.target.value
                                            )
                                        )
                                    }
                                    className={`w-full rounded-sm border ${
                                        verifyIdentity.dob.trim() !==
                                            "" &&
                                        !/^\d{2}\/\d{2}\/\d{4}$/.test(
                                            verifyIdentity.dob
                                        )
                                            ? "border-red-500"
                                            : reqBorder(
                                                  verifyIdentity.dob
                                              )
                                    } px-4 py-4 text-lg text-[#101d3d] outline-none placeholder:text-slate-400`}
                                />
                            </div>

                            <div className="mt-12 border-t border-slate-200" />

                            {/* Employment */}
                            <div className="mt-12">
                                <h2 className="text-2xl text-[#101d3d]">
                                    Employment
                                </h2>

                                <label className="mt-6 mb-2 flex items-center gap-2 text-base text-[#101d3d]">
                                    Employment status{" "}
                                    <span className="text-red-500">
                                        *
                                    </span>

                                    <IoInformationCircleOutline className="h-4 w-4 text-[#09ab75]" />
                                </label>

                                <div className="relative">
                                    <select
                                        value={
                                            verifyIdentity.employmentStatus
                                        }
                                        onChange={(e) =>
                                            updateVerifyIdentity(
                                                "employmentStatus",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full appearance-none rounded-sm border ${reqBorder(
                                            verifyIdentity.employmentStatus
                                        )} px-4 py-4 text-lg text-[#101d3d] outline-none`}
                                    >
                                        <option
                                            value=""
                                            disabled
                                        >
                                            Employment status
                                        </option>

                                        {EMPLOYMENT_STATUSES.map(
                                            (status) => (
                                                <option
                                                    key={status}
                                                    value={status}
                                                >
                                                    {status}
                                                </option>
                                            )
                                        )}
                                    </select>

                                    <IoChevronDownSharp className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#09ab75]" />
                                </div>
                            </div>

                            {/* STEP 2 CONTINUE */}
                            <button
                                onClick={() =>
                                    verifyIdentityValid &&
                                    goToStep(3)
                                }
                                disabled={
                                    !verifyIdentityValid
                                }
                                className={`mt-12 rounded-sm px-14 py-4 text-lg text-white transition ${
                                    verifyIdentityValid
                                        ? "bg-[#09ab75] hover:opacity-90"
                                        : "cursor-not-allowed bg-slate-300"
                                }`}
                            >
                                Continue
                            </button>

                            <p className="mt-6 flex items-center gap-2 text-sm text-slate-600">
                                <BiLock className="h-4 w-4" />
                                Your information is protected
                                with 128-bit SSL encryption.
                            </p>

                            <p className="mt-8 text-sm leading-relaxed text-slate-500">
                                Important information about
                                procedures for opening a new
                                account: To help the government
                                fight the funding of terrorism and
                                money laundering activities, federal
                                law requires all financial
                                institutions to obtain, verify,
                                and record information that
                                identifies each person who opens an
                                account. What this means for you:
                                When you open an account, we will
                                ask for your name, address, date of
                                birth and other information that
                                will allow us to identify you.
                            </p>
                        </div>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                        <div>
                            <h1 className="text-4xl text-[#101d3d]">
                                Open account
                            </h1>

                            <p className="mt-4 text-lg text-slate-700">
                                Review your information and submit
                                to open your account.
                            </p>

                            {error && (
                                <p className="mt-4 rounded-sm bg-red-50 px-4 py-3 text-sm text-red-600">
                                    {error}
                                </p>
                            )}

                            <button
                                onClick={handleSubmission}
                                disabled={loading}
                                className="mt-8 rounded-sm bg-[#09ab75] px-14 py-4 text-lg text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? "Submitting..."
                                    : "Submit"}
                            </button>
                        </div>
                    )}
                </section>

                {/* Help Section */}
                <section className="py-10">
                    <div className="mx-auto max-w-4xl px-8">
                        <h2 className="mb-12 text-3xl font-light">
                            Help and support
                        </h2>

                        <p className="mb-6 text-xl">
                            Need help?{" "}
                            <a
                                href="#"
                                className="text-base font-light text-[#09ab75] underline underline-offset-4"
                            >
                                Contact Us
                            </a>
                        </p>

                        {/* Accordion */}
                        <div className="mx-auto w-full max-w-2xl text-sm">
                            {FAQs.map(
                                (
                                    item,
                                    index: number
                                ) => {
                                    const exists =
                                        index + 1 ===
                                        active;

                                    const ActiveIcon =
                                        exists
                                            ? IoChevronDownSharp
                                            : IoChevronForward;

                                    return (
                                        <div
                                            key={index}
                                            onClick={() =>
                                                handleActive(
                                                    index + 1
                                                )
                                            }
                                            className="mb-6 cursor-pointer"
                                        >
                                            {/* Question row */}
                                            <div
                                                className={`flex items-center gap-3 px-2 py-4 ${
                                                    exists
                                                        ? "w-fit border border-[#09ab75]"
                                                        : ""
                                                }`}
                                            >
                                                <ActiveIcon className="shrink-0 text-xl text-[#09ab75]" />

                                                <h1 className="text-lg text-[#09ab75]">
                                                    {item.q}
                                                </h1>
                                            </div>

                                            {exists && (
                                                <div className="mt-3 px-2 text-base leading-relaxed text-slate-700">
                                                    {item.a}
                                                </div>
                                            )}

                                            {!exists && (
                                                <div />
                                            )}
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                </section>
            </section>

            <UserFooter />
        </div>
    );
}
