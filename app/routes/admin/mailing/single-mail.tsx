import { Button, Textarea, TextInput } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import { transact_urls } from '~/component/endpoints/transact'

export default function SingleMail() {
    const [form, setForm] = useState({
        email: '',
        firstname: '',
        lastname: '',
        subject: '',
        message: '',
    })
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((prev) => ({ ...prev, [key]: e.target.value }))

    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            const res = await transact_urls.sendSingleMail(form)
            return res.data
        },
        onSuccess: (data) => {
            setFeedback({ type: 'success', text: data?.msg || 'Mail sent successfully' })
            setForm({ email: '', firstname: '', lastname: '', subject: '', message: '' })
        },
        onError: (error: any) => {
            setFeedback({ type: 'error', text: error?.response?.data?.msg || 'Failed to send mail' })
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setFeedback(null)
        if (!form.email || !form.subject || !form.message) {
            setFeedback({ type: 'error', text: 'Email, subject and message are required' })
            return
        }
        mutate()
    }

    return (
        <div>
            <div className="m-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-[1.9rem] font-semibold">Send Mail</div>
                </div>

                <div className="border rounded-2xl border-gray-200">
                    <form onSubmit={handleSubmit} className="m-5">
                        <div className="">
                            <TextInput
                                label="Recipient email"
                                placeholder="user@example.com"
                                required
                                value={form.email}
                                onChange={update('email')}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <TextInput
                                    label="First name"
                                    placeholder="Optional"
                                    value={form.firstname}
                                    onChange={update('firstname')}
                                />
                                <TextInput
                                    label="Last name"
                                    placeholder="Optional"
                                    value={form.lastname}
                                    onChange={update('lastname')}
                                />
                            </div>
                        </div>

                        <TextInput
                            label="Subject"
                            placeholder="Mail subject"
                            required
                            value={form.subject}
                            onChange={update('subject')}
                        />

                        <Textarea
                            label="Message"
                            placeholder="Write your message..."
                            required
                            autosize
                            minRows={6}
                            value={form.message}
                            onChange={update('message')}
                        />

                        {feedback && (
                            <div
                                className={`text-sm font-medium ${
                                    feedback.type === 'success' ? 'text-green-600' : 'text-red-600'
                                }`}
                            >
                                {feedback.text}
                            </div>
                        )}

                        <div className="flex justify-end pt-2">
                            <Button type="submit" loading={isPending} className="bg-primary">
                                Send Mail
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}