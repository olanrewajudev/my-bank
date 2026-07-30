import { useForm } from '@mantine/form'
import React from 'react'
import { FiSearch } from 'react-icons/fi'
import { IoIosSearch } from 'react-icons/io'
import { IoEllipsisHorizontalSharp, IoFilter } from 'react-icons/io5'
import Forminput from '~/components/general/Forminput'
import Table from '~/components/table/Table'
import Tbody from '~/components/table/Tbody'
import Td from '~/components/table/Td'
import Thead from '~/components/table/Thead'
import Tr from '~/components/table/Tr'

type componentProps = {
    headers: string[]
    children: React.ReactNode
    title: string
    subtitle: string
    headerFilters: string[]
}

export default function TableContainer(props: componentProps) {
    const [activeHeader, setActiveHeader] = React.useState(props.headerFilters[0])
    return (
        <div>
            <div className="text-xs!">
                <div className="">
                    <div className="flex flex-wrap flex-row items-center justify-between gap-5 px-3 py-4 border-b border-zinc-400">
                        <div className="">
                            <div className="font-bold text-lg">{props.title}</div>
                            <div className="text-zinc-600">{props.subtitle}</div>
                        </div>
                        <div className="flex flex-row items-center gap-3">
                            {props.headerFilters.map((item, index) => (
                                <div onClick={() => setActiveHeader(item)} className={`cursor-pointer active:scale-95 transition-all border rounded-full py-1.5 px-4 ${activeHeader === item ? 'bg-black text-white' : ''}`} key={index}>{item}</div>
                            ))}
                            <IoEllipsisHorizontalSharp className='text-lg' />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-8 items-center gap-5 px-3 py-4 border-b border-zinc-400">
                        <div className="md:col-span-4">
                            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                                <div className="md:col-span-5"><SearchComponent /></div>
                                <div className="md:col-span-2 flex items-center gap-2 py-2.5 px-4 rounded-full border cursor-pointer active:scale-95 transition-all h-fit w-20 font-semibold justify-center"> <div> <IoFilter /> </div> <span>Filters</span> </div>
                            </div>
                        </div>
                        <div className="md:col-span-4">
                            <div className="text-right">Showing 1-50 of 500</div>
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto scrollsdown">
                        <Table>
                            <Thead>
                                <Tr header={true} last={false}>
                                    {props.headers.map((item, index) => (
                                        <Td key={index} className='font-semibold'>{item}</Td>
                                    ))}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {props.children}
                            </Tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}


function SearchComponent() {
    return (
        <div className="relative">
            <div className="absolute top-2 left-1 text-lg">
                <IoIosSearch />
            </div>
            <input type="text" className='py-2.5 pr-3 pl-8 rounded-full w-full text-xs border outline-none' placeholder='Search' />
        </div>
    )
}