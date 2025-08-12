import { NextResponse } from 'next/server';
import calculateNumberOfLeaveDays from '../../components/lib/calculateNumberOfLeaveDays';

export async function POST(req) {
    try {
        const { name, leaveType, startDate, endDate, reason } = await req.json();

        const apiKey = process.env.HUGGINGFACE_API_KEY;
        const totalLeaveDays = calculateNumberOfLeaveDays(startDate, endDate);

        const prompt = `Write a formal ${leaveType} leave application without changing format for ${name} from ${startDate} to ${endDate} with total days ${totalLeaveDays}. Reason: ${reason}.the format should be like this ,  modify the content as per the request  :
Subject: Leave Application - [Your Name]

Dear [Supervisor's Name],

I hope this message finds you well. I am writing to formally request a leave of absence from [start date] to [end date].
The current project I am working on is [pending work], and this project will be handled by [person who will handle the work (must be kept in cc)] during my leave

Here are the details of my leave request:

Leave Type: [e.g., Annual Leave, Sick Leave, Unpaid Leave, etc.]

Start Date: [Date when you intend to start your leave]

End Date: [Date when you plan to return]

Total Number of Leave Days Requested: [Total number of leave days]

Reason for Leave: [Provide a brief explanation of the reason for your leave]

Contact Information During My Leave: [Provide an alternate contact method, if applicable]

I kindly request your approval for this leave, and I am ready to discuss any additional details or concerns you may have.

Thank you for considering my request. I appreciate your understanding and support in this matter.

Sincerely,

[Your Name]
[Your Employee ID]
[Department Name]
[Your Contact Information]`;
        const payload = {
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            model: 'openai/gpt-oss-120b:groq',
        };

        const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`, // Use your actual token in .env
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const text = await response.text();

        try {
            const data = JSON.parse(text);
            const aiMessage = data?.choices?.[0]?.message?.content;
            if (!aiMessage) {
                return NextResponse.json({ error: 'No AI message generated' }, { status: 500 });
            }

            return NextResponse.json({ message: aiMessage }, { status: 200 });
        } catch (err) {
            return NextResponse.json(
                { error: 'Invalid JSON response from Hugging Face', details: text },
                { status: 500 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
