import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function handler(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { name, email, messageA, messageB, source } = JSON.parse(event.body);

    // Validate required fields
    if (!name || !email || !messageA) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Determine the subject and content based on source
    const subject = source === 'yes' 
      ? `💘 Valentine's Yes! from ${name}` 
      : `💔 Valentine's No... from ${name}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: ${source === 'yes' ? '#e91e63' : '#757575'}; text-align: center;">
          ${source === 'yes' ? '💘 She Said YES!' : '💔 She Said No...'}
        </h2>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Answer:</strong> <span style="color: ${source === 'yes' ? '#e91e63' : '#757575'}; font-weight: bold;">${source.toUpperCase()}</span></p>
        </div>

        ${messageA ? `
        <div style="background: white; padding: 20px; border-left: 4px solid ${source === 'yes' ? '#e91e63' : '#757575'}; margin: 20px 0;">
          <h3 style="margin-top: 0;">Her Message:</h3>
          <p style="font-style: italic; line-height: 1.6;">${messageA}</p>
        </div>
        ` : ''}

        ${messageB ? `
        <div style="background: white; padding: 20px; border-left: 4px solid #2196f3; margin: 20px 0;">
          <h3 style="margin-top: 0;">Additional Message:</h3>
          <p style="font-style: italic; line-height: 1.6;">${messageB}</p>
        </div>
        ` : ''}

        <div style="text-align: center; margin-top: 30px; padding: 20px; background: #fafafa; border-radius: 10px;">
          <p style="color: #666; font-size: 14px;">
            Sent from your Valentine's Day Surprise App 💕
          </p>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Valentine Surprise <onboarding@resend.dev>',
      to: ['brayanmlawa0917@gmail.com'],
      subject: subject,
      html: htmlContent,
      replyTo: email,
    });

    if (error) {
      console.error('Resend error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to send email' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        id: data.id 
      }),
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
}
