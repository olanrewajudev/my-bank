import { useDisclosure } from '@mantine/hooks'
import { useState } from "react"
import { LiaTimesSolid } from "react-icons/lia"
import { FaEye, FaEyeSlash, FaUser } from 'react-icons/fa'
import { IoIosNotifications } from "react-icons/io"
import { CiGlobe } from 'react-icons/ci'
import { Drawer, Modal } from '@mantine/core'
import { useForm } from '@mantine/form'
import { SlMenu } from 'react-icons/sl'
import { Link, useNavigate } from 'react-router'
import Cookies from 'js-cookie'
import { MdLogout } from 'react-icons/md'
import { adminSidebar, ErrorAlert, HotAlert } from '../utils'
import { CookieName } from '../Apis'
import Forminput from '../general/form-input'
import Formbutton from '../general/form-button'

export default function Header() {
    const [opened, { open, close }] = useDisclosure(false)
    const [sidebarOpened, { open: openSidebar, close: closeSidebar }] = useDisclosure()
    const [pass1, setPass1] = useState(false)
    const [pass2, setPass2] = useState(false)
    const [pass3, setPass3] = useState(false)
    const Icon1 = pass1 ? FaEye : FaEyeSlash
    const Icon2 = pass2 ? FaEye : FaEyeSlash
    const Icon3 = pass3 ? FaEye : FaEyeSlash

    const form = useForm({
        mode: "uncontrolled",
        initialValues: { current_password: '', password: '', confirm_password: "" },
        validate: {
            current_password: value => !value ? 'Current password is required' : null,
            password: (v) => v.length < 6 ? 'Password too short' : null,
            confirm_password: (v, values) => v !== values.password ? 'Passwords do not match' : null,
        }
    })

    async function HandleSubmission(values: typeof form.values) {
        try {
            // const res = await AuthPosturl(Apis.users.updatepassword, values)
            // HotAlert(res.data.msg)
            close()
        } catch (error) {
            ErrorAlert((error as Error).message)
        }
    }

    const navigate = useNavigate()
    const [openedlogout, { open: openLogout, close: closeLogout }] = useDisclosure(false)

    const Logout = async () => {
        Cookies.remove(CookieName)
        HotAlert('User logged out successfully')

        setTimeout(() => {
            navigate('/')
            window.location.reload()
        }, 100)
    }

    return (
        <>
            {/* Logout confirm */}
            <Modal size={'30rem'} centered withCloseButton={false} opened={openedlogout} onClose={closeLogout}>
                <div className="my-2">
                    <div className="text-[1.3rem] font-bold text-center mb-1 text-gray-900">Logout</div>
                    <div className="text-center">
                        <div className="mb-5">
                            <div className="font-semibold text-gray-900">Are you sure you want to log out of your account?</div>
                            <p className="text-sm text-gray-500 mt-1">You'll need to sign in again to continue.</p>
                        </div>
                        <div className="flex items-center justify-between gap-3 mt-4">
                            <button onClick={closeLogout} className="w-full py-2.5 rounded-full bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors">Cancel</button>
                            <button onClick={Logout} className="w-full py-2.5 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors">Logout</button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Change password */}
            <Modal size={'30rem'} centered withCloseButton={false} opened={opened} onClose={close}>
                <div className="my-2">
                    <div className="text-center text-xl font-bold text-gray-900">Change Password</div>
                    <p className="text-center text-sm text-gray-500 mt-1">Choose a new password for your account.</p>
                    <form onSubmit={form.onSubmit(HandleSubmission)} className="mt-6 space-y-1">
                        <div className="relative">
                            <Forminput
                                content="Current Password"
                                error={form.errors.current_password?.toString() || ""}
                                {...form.getInputProps("current_password")}
                                placeholder="Password"
                                type={pass1 ? "text" : "password"}
                            />
                            <div onClick={() => setPass1(!pass1)} className="absolute right-4 top-9.5 cursor-pointer text-gray-400 hover:text-gray-600"><Icon1 /></div>
                        </div>
                        <div className="relative">
                            <Forminput
                                content="New Password"
                                error={form.errors.password?.toString() || ""}
                                {...form.getInputProps("password")}
                                placeholder="Password"
                                type={pass2 ? "text" : "password"}
                            />
                            <div onClick={() => setPass2(!pass2)} className="absolute right-4 top-9.5 cursor-pointer text-gray-400 hover:text-gray-600"><Icon2 /></div>
                        </div>
                        <div className="relative">
                            <Forminput
                                content="Confirm New Password"
                                error={form.errors.confirm_password?.toString() || ""}
                                {...form.getInputProps("confirm_password")}
                                placeholder="Password"
                                type={pass3 ? "text" : "password"}
                            />
                            <div onClick={() => setPass3(!pass3)} className="absolute right-4 top-9.5 cursor-pointer text-gray-400 hover:text-gray-600"><Icon3 /></div>
                        </div>

                        <div className="pt-3">
                            <Formbutton title="Change Password" className="bg-[#7c5cf0] text-white font-bold" />
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Mobile nav drawer */}
            <Drawer opened={sidebarOpened} onClose={closeSidebar} position="left" withCloseButton={false} size="18rem">
                <div className="flex items-center justify-between px-1 py-1">
                    <Link to="/admin/dashboard">
                        <img src="/logo-dark.png" alt="Cryptocoin" className="w-[10rem]" />
                    </Link>
                    <button onClick={closeSidebar} className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer">
                        <LiaTimesSolid size={18} />
                    </button>
                </div>

                <nav className="flex flex-col mt-6 space-y-0.5">
                    {adminSidebar.map((item, index) => {
                        const isActive = Array.isArray(item.url)
                            ? item.url.some((path: string) => location.pathname.startsWith(path.replace('/:id', '')))
                            : location.pathname === item.url

                        return (
                            <Link
                                key={index}
                                onClick={closeSidebar}
                                to={Array.isArray(item.url) ? item.url[0] : item.url}
                                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                                    ${isActive
                                        ? 'bg-[#7c5cf0]/10 text-[#7c5cf0] font-semibold'
                                        : 'text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                {isActive && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-[#7c5cf0]" />
                                )}
                                <item.Icon className={`text-lg shrink-0 ${isActive ? 'text-[#7c5cf0]' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                <span className="truncate">{item.title}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="border-t border-gray-200 mt-4 pt-3">
                    <button
                        type="button"
                        onClick={() => { closeSidebar(); openLogout() }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                        <MdLogout className="text-lg shrink-0" />
                        Logout
                    </button>
                </div>
            </Drawer>

            {/* Top bar */}
            <div className="sticky top-0 left-0 border-b px-5 lg:px-10 border-gray-200 z-50 bg-white">
                <div className="flex flex-row items-center gap-5 justify-between py-3">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden text-gray-600 cursor-pointer" onClick={openSidebar}>
                            <SlMenu size={18} />
                        </button>
                        <Link to="/admin/dashboard">
                            <img src="/logo-dark.png" loading="lazy" className="h-9 w-auto object-contain" />
                        </Link>
                    </div>

                    <div className="flex items-center gap-1">
                        <button onClick={open}
                            className="ml-1 w-9 h-9 rounded-full bg-[#7c5cf0]/10 text-[#7c5cf0] flex items-center justify-center hover:bg-[#7c5cf0]/20 transition-colors cursor-pointer">
                            <FaUser size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}