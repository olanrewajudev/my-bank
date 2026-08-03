import { useForm } from "@mantine/form";
import Cookies from "js-cookie";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { ErrorAlert, HotAlert } from "~/component/utils";
import { Link } from 'react-router'
import {  CookieName } from "~/component/Apis";
import { Admin_urls } from "~/component/endpoints/admin";
import { dispatchToken } from "~/lib/reducer";
import Forminput from "~/component/general/form-input";
import Formbutton from "~/component/general/form-button";
export default function AdminLogin() {
    const [pass1, setPass1] = useState(false);
    const Icon1 = pass1 ? FaEye : FaEyeSlash;
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const form = useForm({
        mode: "uncontrolled", initialValues: { email: '', password: '', tag:'admin' },
        validate: {
            email: value => !value ? 'Email address is required' : null,
            password: value => !value ? 'Password is required' : null
        }
    })

    async function HandleSubmission(values: typeof form.values) {

        try {
            const res = await Admin_urls.login(values)
            console.log(res.status)
            if (res.status === 200) {
                const token = res.data.token;
                Cookies.set(CookieName, token);
                dispatch(dispatchToken(token));
                HotAlert(res.data.msg)
                navigate('/admin/dashboard');

            }
        } catch (error) {
            ErrorAlert((error as Error).message)
        }
    }
    return (
        <div className="flex items-center justify-center h-screen">
            <div className='bg-blue w-[80%] mx-auto py-10 px-5 rounded-xl'>
                <div className=" text-center font-extrabold text-4xl md:text-5xl font-base mb-10 mt-3">Log In As Admin</div>
                <form onSubmit={form.onSubmit(HandleSubmission)}>
                    <Forminput content="Username or Email" error={form.errors.email?.toString() || ''}{...form.getInputProps("email")} placeholder='Username or Email'  />
                    <div className="relative mt-4">
                        <Forminput content="Password" error={form.errors.password?.toString() || ""} {...form.getInputProps("password")} placeholder="Password" type={pass1 ? "text" : "password"} />
                        <div onClick={() => setPass1(!pass1)} className="absolute right-4 top-9.5 cursor-pointer text-dark-gray"><Icon1 /></div>
                    </div>
                    <div className="space-y-3 mt-14">
                        <Formbutton title="Continue" className='bg-white font-bold ' loading={form.submitting} />
                    </div>
                </form>
            </div>
        </div>
    )
}
