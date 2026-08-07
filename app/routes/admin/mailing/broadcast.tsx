import { Button, Textarea, TextInput } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import { transact_urls } from '~/component/endpoints/transact'

export default function Broadcast() {
    const [form, setForm] = useState({ subject: '', message: '' })
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [confirming, setConfirming] = useState(false)

    const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((prev) => ({ ...prev, [key]: e.target.value }))

    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            const res = await transact_urls.sendBroadcastMail(form)
            return res.data
        },
        onSuccess: (data) => {
            setFeedback({ type: 'success', text: data?.msg || 'Broadcast sent successfully' })
            setForm({ subject: '', message: '' })
            setConfirming(false)
        },
        onError: (error: any) => {
            setFeedback({ type: 'error', text: error?.response?.data?.msg || 'Failed to send broadcast' })
            setConfirming(false)
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setFeedback(null)
        if (!form.subject || !form.message) {
            setFeedback({ type: 'error', text: 'Subject and message are required' })
            return
        }
        if (!confirming) {
            setConfirming(true)
            return
        }
        mutate()
    }

    return (
        <div>
            <div className="m-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-[1.9rem] font-semibold">Broadcast Mail</div>
                </div>

                <div className="border rounded-2xl border-gray-200">
                    <form onSubmit={handleSubmit} className="p-5 space-y-4 max-w-2xl">
                        <div className="text-sm text-yellow-600 font-medium">
                            This mail will be sent to every registered user.
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

                        <div className="flex items-center justify-end gap-3 pt-2">
                            {confirming && (
                                <Button
                                    type="button"
                                    variant="subtle"
                                    color="gray"
                                    onClick={() => setConfirming(false)}
                                    disabled={isPending}
                                >
                                    Cancel
                                </Button>
                            )}
                            <Button type="submit" loading={isPending} className="bg-primary">
                                {confirming ? 'Confirm & Send to All Users' : 'Send Broadcast'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}