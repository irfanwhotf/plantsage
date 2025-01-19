import { Resend } from 'resend';
import { NextResponse } from 'next/server';

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, feedback, plantName } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'PlantSage <onboarding@resend.dev>',
      to: ['mohammediirfan2006@gmail.com'],
      subject: `PlantSage Feedback: ${plantName || 'General Feedback'}`,
      html: `
        <h2>New Feedback Received</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Plant Name:</strong> ${plantName || 'N/A'}</p>
        <p><strong>Feedback:</strong></p>
        <p>${feedback}</p>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ message: 'Feedback sent successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error sending feedback' }, { status: 500 });
  }
}
