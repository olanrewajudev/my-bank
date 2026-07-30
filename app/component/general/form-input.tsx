import { PinInput, Textarea, TextInput } from "@mantine/core"
import React, { forwardRef } from "react"
import { IoChevronDown, IoSearch } from "react-icons/io5"
import type { ForminputProps } from "../../../global"

type Option = {
    label: string
    value: string
}

const Forminput = forwardRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, ForminputProps & { options?: Option[], required?: boolean, textareaHeight?: string | number, maxLength?: string | number, withSearchIcon?: boolean }>(({ nobg = false, formtype = "input", options = [], required = false, textareaHeight, withSearchIcon, maxLength = false, ...props }, ref
) => {
    const formStyle = {
        input: {
            padding: withSearchIcon ? "1.2rem 1rem 1.5rem 3rem" : "1.2rem 1rem 1.5rem 1rem",
            borderRadius: formtype === "textarea" ? "1rem" : "2rem",
            height: formtype === "textarea" ? typeof textareaHeight === "number" ? `${textareaHeight}px` : textareaHeight || "13rem" : undefined,
            width: "100%",
            color: nobg ? "#fff" : "#000",
            border: `1.1px solid ${props.error ? "#ff0000" : nobg ? "#E9EAEB" : "#E5E7EB"}`,
            background: props.readOnly ? "#F2F2F2" : nobg ? "transparent" : "#fff",
        },
        labelRequired: { color: "#ff0000" },
    }

    return (
        <div className="mb-3">
            <div className={formtype === "select" ? "" : "mb-4"}>
                {formtype === "input" && (
                    <TextInput
                        {...props}
                        ref={ref as React.Ref<HTMLInputElement>}
                        type={props.type}
                        label={props.content}
                        placeholder={props.placeholder}
                        readOnly={props.readOnly}
                        error={props.error}
                        required={required}
                        leftSection={withSearchIcon ? <IoSearch size={18} className="text-black relative -top-[2px]" /> : undefined}
                        leftSectionWidth={withSearchIcon ? 44 : undefined}
                        styles={formStyle}
                        maxLength={maxLength ? Number(maxLength) : undefined}
                    />
                )}


                {/* TEXTAREA */}
                {formtype === "textarea" && (
                    <Textarea
                        {...props}
                        ref={ref as React.Ref<HTMLTextAreaElement>}
                        label={props.content}
                        placeholder={props.placeholder}
                        readOnly={props.readOnly}
                        error={props.error}
                        styles={formStyle}
                        required={required}
                    />
                )}

                {/* OTP */}
                {formtype === "otp" && (
                    <div>
                        <PinInput
                            {...props}
                            ref={ref as React.Ref<HTMLInputElement>}
                            readOnly={props.readOnly}
                            type="alphanumeric"
                            length={6}
                            size="lg"
                            placeholder=""
                            error={props.pinerror === "true"}
                            styles={{
                                input: { border: "1.3px solid #000", fontSize: "2rem", color: "#000", },
                            }}
                        />

                        {props.error && (<div className="text-red-400 text-xs mt-1">{props.error}</div>)}
                    </div>
                )}
            </div>

            {formtype === "select" && (
                <div>
                    {props.content && (
                        <label className="mb-1 block text-sm">
                            {props.content}
                            {required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                    )}

                    <div className="relative ">
                        <select ref={ref as React.Ref<HTMLSelectElement>} disabled={props.readOnly} {...props} className={`appearance-none outline-none bg-transparent pr-12  ${props.className ?? "w-full border border-gray-300 rounded-full py-2 px-4"}`}>
                            {options.map((option: any, index: React.Key) => (
                                <option key={index} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <IoChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                    </div>

                    {props.error && (<div className="text-red-500 text-xs mt-1">{props.error}</div>)}
                </div>
            )}
        </div>
    )
}
)

Forminput.displayName = "Forminput"
export default Forminput
