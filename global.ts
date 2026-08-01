import type { ReactNode } from "react";

export interface User {
id?: string;
firstname: string;
lastname: string;
mi: string | null;
email: string;
phone: string;
altphone: string | null;
accounttype: string;
role: string;
address: string;
aptsuite: string | null;
city: string;
state: string;
zipcode: string;
citizenship: string;
dob: string;
agreed: string;
submitted: string;
suspended: string;
status: string;
ismsg: string;
image: string | null;
note: string | null;
employmentstatus: string | null;
currbonus: number;
totalbonus: number;
deposits: number;
withdraws: number;
refid: string;
upline: string | null;
wallets: unknown[];
withdmsg: string | null;
lastlogin: string;
createdAt: string;
name?: string;
acctnumber: string;
token?: string;
}


export interface Admin {
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface AuthState {
  user: User | null;
  admin: Admin | null;
  userLoggedIn: boolean;
  adminLoggedIn: boolean;
  token: string;
}


export interface PersonalInfo {
    firstName: string
    mi: string
    lastName: string
    email: string
    phone: string
    password: string
    confirmPassword: string
    agreed: boolean
}

export interface VerifyIdentity {
    primaryAddress: string
    aptSuite: string
    city: string
    state: string
    zip: string
    countryOfCitizenship: string
    alternatePhone: string
    dob: string
    confirmSsn: string
    employmentStatus: string
}

export interface FormbuttonProps {
  title: string
  disabled?: boolean
  className?: string
  Icon?: any
  loading?: boolean
  type?: "submit" | "reset" | "button"
  position?: "left" | "right"
  onClick?: (val: any) => void
}

export interface ForminputProps {
    valueName?: string
    tagNames?: string[] | undefined
    nobg?: boolean
    readOnly?: boolean
    styles?: any
    currencyValue?: string
    setup?: (value: phoneSelectorSetup) => void
    setFieldValue?: any
    valueText?: string | null
    className?: string
    dateTag?: 'From' | 'To' | ""
    formtype?: "textarea" | "password" | "select" | "input" | "date" | "phone" | "currency" | "custom-selector" | "url" | "number" | 'tags' | "otp"
    content: string
    type?: string
    children?: ReactNode
    options?: any
    placeholder?: string
    error: string
    pinerror?: string
    value?: string
    minDate?: string
    maxDate?: string
    defaultDate?: string
    onChange?: any
    picker?: "date" | "month" | "quarter" | "time" | "week" | "year"
    textareaHeight?: string | number

}

export interface phoneSelectorSetup {
  code?: string
  dial_code?: string
  abbreviation?: string
}


export interface CardItem {
  id: string
  number: string
  cvv: string
  expire: string
}
