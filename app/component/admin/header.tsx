import { GoChevronDown, GoDotFill } from 'react-icons/go'
import { IoIosNotifications, IoIosSearch } from "react-icons/io"
import { useDisclosure } from '@mantine/hooks'
import { useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import { FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';
import { CiGlobe } from 'react-icons/ci';
import { Drawer, Modal } from '@mantine/core';
import { useForm } from '@mantine/form';
import { SlMenu } from 'react-icons/sl';
import { Link, useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import { MdLogout } from 'react-icons/md';
import { adminSidebar, ErrorAlert, HotAlert } from '../utils';
import { CookieName } from '../Apis';
import Forminput from '../general/form-input';
import Formbutton from '../general/form-button';
export default function Header() {
    const [opened, { open, close }] = useDisclosure(false)
    const [sidebarOpened, { open: openSidebar, close: closeSidebar }] = useDisclosure()
    const [pass1, setPass1] = useState(false);
    const [pass2, setPass2] = useState(false);
    const [pass3, setPass3] = useState(false);
    const Icon1 = pass1 ? FaEye : FaEyeSlash;
    const Icon2 = pass2 ? FaEye : FaEyeSlash;
    const Icon3 = pass3 ? FaEye : FaEyeSlash;

    const form = useForm({
        mode: "uncontrolled", initialValues: { current_password: '', password: '', confirm_password: "" },
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
            <Modal size={'32rem'} centered withCloseButton={false} opened={openedlogout} onClose={closeLogout}>
                <div className="my-4">
                    <div className="text-error text-[1.5rem] font-bold text-center mb-2">Logout</div>
                    <div className="text-center">
                        <div className="mb-5">
                            <div className="font-semibold text-lg">Are you sure you want to log out of your account?</div>
                            <p className="">You’ll need to sign in again to continue.</p>
                        </div>
                        <div className="flex items-center justify-between gap-3 mt-4">
                            <div onClick={closeLogout} className="bg-darkgray w-full rounded-full py-2.5 font-semibold text-center cursor-pointer ">Cancel</div>
                            <div onClick={Logout} className="bg-red-800 w-full rounded-full py-2.5 font-semibold text-center cursor-pointer text-white">Logout</div>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal size={'32rem'} centered withCloseButton={false} opened={opened} onClose={close}>
                <div className="">
                    <div className="text-center text-2xl font-semibold">Change Password</div>
                    <form onSubmit={form.onSubmit(HandleSubmission)} className="my-6">
                        <div className="relative">
                            <Forminput content="Current Password" error={form.errors.current_password?.toString() || ""} {...form.getInputProps("current_password")} placeholder="Password" type={pass1 ? "text" : "password"} />
                            <div onClick={() => setPass1(!pass1)} className="absolute right-4 top-9.5 cursor-pointer text-dark-gray"><Icon1 /></div>
                        </div>
                        <div className="relative">
                            <Forminput content="New Password" error={form.errors.password?.toString() || ""} {...form.getInputProps("password")} placeholder="Password" type={pass1 ? "text" : "password"} />
                            <div onClick={() => setPass2(!pass2)} className="absolute right-4 top-9.5 cursor-pointer text-dark-gray"><Icon2 /></div>
                        </div>
                        <div className="relative">
                            <Forminput content="Confirm New Password" error={form.errors.confirm_password?.toString() || ""} {...form.getInputProps("confirm_password")} placeholder="Password" type={pass1 ? "text" : "password"} />
                            <div onClick={() => setPass3(!pass3)} className="absolute right-4 top-9.5 cursor-pointer text-dark-gray"><Icon3 /></div>
                        </div>

                        <Formbutton title='Change' />
                    </form>
                </div>
            </Modal>
            <Drawer className='' opened={sidebarOpened} onClose={closeSidebar} position='left' withCloseButton={false} >
                <div className="flex items-center justify-between  rounded-full px-4 py-1">
                    <Link to='/admin/dashboard' className=""> <img src='/logo-dark.png' alt="Cryptocoin" className="w-[13rem]" /> </Link>
                    <div onClick={closeSidebar} className="cursor-pointer"><LiaTimesSolid /></div>
                </div>
                <div>
                    <div className="flex flex-col mt-5">
                        {adminSidebar.map((item, index) => {
                            const isActive = Array.isArray(item.url) ? item.url.some((path: string) => location.pathname.startsWith(path.replace('/:id', ''))) : location.pathname === item.url
                            return (
                                <Link key={index} onClick={closeSidebar} to={Array.isArray(item.url) ? item.url[0] : item.url} className={`flex items-center gap-2 p-2 transition-all rounded-lg ${isActive ? 'bg-yellow-dark' : ''}`}><item.Icon className="text-lg" /><span>{item.title}</span></Link>

                            )

                        })}
                        <div onClick={() => { closeSidebar(), openLogout() }} className="flex items-center gap-2 p-2 text-error font-bold text-lg rounded-full cursor-pointer"><MdLogout /> Logout</div>

                    </div>
                </div>
            </Drawer >
            <div className="sticky top-0 left-0 border-b px-10 border-gray-200 z-50 bg-white">
                <div className='flex flex-row items-center gap-5 justify-between  py-3'>
                    <div className="flex items-center gap-4">
                        <div className="lg:hidden block" onClick={openSidebar}><SlMenu /></div>
                        <Link to='/admin/dashboard' className=""> <img src="/logo-dark.png" loading="lazy" className="h-10 w-auto object-contain" /> </Link>
                    </div>
                    <div className="flex text-xl gap-3">
                        <div className=""><IoIosNotifications /></div>
                        <div className=""><CiGlobe /></div>
                        <div className="" onClick={open}><FaUser /></div>
                    </div>
                </div>
            </div>

        </>
    )
}
