import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, messageA, messageB, source, deviceInfo, locationInfo, timestamp, type } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Modern color scheme for Cylvenda Valentine App
    const colors = {
      primary: source === 'yes' ? '#FF1493' : '#4A5568', // Deep Pink vs Gray
      secondary: source === 'yes' ? '#FF69B4' : '#718096', // Hot Pink vs Light Gray
      accent: source === 'yes' ? '#FFB6C1' : '#CBD5E0', // Light Pink vs Lighter Gray
      background: source === 'yes' ? '#FFF0F5' : '#F7FAFC', // Lavender Blush vs Light Gray
      text: '#2D3748',
      white: '#FFFFFF'
    };

    // Determine the subject and content based on source and type
    const isImmediateResponse = type === 'immediate_response';
    const isMessageResponse = type === 'message_response';
    
    let subject, headerBg, headerText, typeColor, typeBg;
    
    if (isImmediateResponse) {
      subject = source === 'yes' 
        ? `💘 IMMEDIATE: Valentine's Yes! from ${name}` 
        : `💔 IMMEDIATE: Valentine's No... from ${name}`;
      headerBg = '#FF6B6B';
      headerText = colors.white;
      typeColor = '#DC2626';
      typeBg = '#FEE2E2';
    } else if (isMessageResponse) {
      subject = source === 'yes' 
        ? `💕 MESSAGE: Valentine's Yes! from ${name}` 
        : `💔 MESSAGE: Valentine's No... from ${name}`;
      headerBg = '#10B981';
      headerText = colors.white;
      typeColor = '#059669';
      typeBg = '#D1FAE5';
    } else {
      subject = source === 'yes' 
        ? `💘 Valentine's Yes! from ${name}` 
        : `💔 Valentine's No... from ${name}`;
      headerBg = colors.primary;
      headerText = colors.white;
      typeColor = colors.secondary;
      typeBg = colors.accent;
    }

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background: linear-gradient(135deg, ${colors.background} 0%, ${colors.white} 100%); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, ${headerBg} 0%, ${colors.secondary} 100%); padding: 30px 20px; text-align: center; position: relative;">
          <div style="position: absolute; top: 10px; right: 15px; background: rgba(255,255,255,0.2); padding: 5px 10px; border-radius: 15px; font-size: 11px; color: ${headerText};">
            Cylvenda Valentine App
          </div>
          <h1 style="color: ${headerText}; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            ${isImmediateResponse ? '💘 She Said YES!' : isMessageResponse ? '💕 She Wrote a Message!' : source === 'yes' ? '💘 She Said YES!' : '💔 She Said No...'}
          </h1>
          ${isImmediateResponse ? `<p style="color: ${headerText}; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">🚨 IMMEDIATE CLICK RESPONSE</p>` : ''}
          ${isMessageResponse ? `<p style="color: ${headerText}; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">📝 Optional Message Response</p>` : ''}
        </div>
        
        <!-- User Info Card -->
        <div style="background: ${colors.white}; margin: 20px; padding: 25px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <div style="width: 50px; height: 50px; background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; margin-right: 15px;">
              ${source === 'yes' ? '💘' : '💔'}
            </div>
            <div>
              <h2 style="margin: 0; color: ${colors.text}; font-size: 20px;">${name}</h2>
              <p style="margin: 5px 0 0 0; color: ${colors.secondary}; font-size: 14px;">${email}</p>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div style="background: ${colors.background}; padding: 15px; border-radius: 10px;">
              <p style="margin: 0; color: ${colors.secondary}; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Answer</p>
              <p style="margin: 5px 0 0 0; color: ${colors.primary}; font-size: 18px; font-weight: bold;">${source.toUpperCase()}</p>
            </div>
            <div style="background: ${colors.background}; padding: 15px; border-radius: 10px;">
              <p style="margin: 0; color: ${colors.secondary}; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Time</p>
              <p style="margin: 5px 0 0 0; color: ${colors.text}; font-size: 14px;">${timestamp ? new Date(timestamp).toLocaleString() : new Date().toLocaleString()}</p>
            </div>
          </div>
          
          ${isImmediateResponse || isMessageResponse ? `
          <div style="background: ${typeBg}; padding: 15px; border-radius: 10px; margin-top: 15px; border-left: 4px solid ${typeColor};">
            <p style="margin: 0; color: ${typeColor}; font-size: 14px; font-weight: bold;">
              ${isImmediateResponse ? '🚨 Immediate Click Response' : '📝 Optional Message Response'}
            </p>
          </div>
          ` : ''}
        </div>

        ${messageA ? `
        <div style="background: ${colors.white}; margin: 0 20px 20px 20px; padding: 25px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-left: 4px solid ${colors.primary};">
          <h3 style="margin: 0 0 15px 0; color: ${colors.text}; font-size: 18px; display: flex; align-items: center;">
            <span style="margin-right: 8px;">💭</span> Message
          </h3>
          <p style="margin: 0; color: ${colors.text}; line-height: 1.6; font-size: 16px; font-style: italic;">${messageA}</p>
        </div>
        ` : ''}

        ${messageB ? `
        <div style="background: ${colors.white}; margin: 0 20px 20px 20px; padding: 25px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-left: 4px solid #3B82F6;">
          <h3 style="margin: 0 0 15px 0; color: ${colors.text}; font-size: 18px; display: flex; align-items: center;">
            <span style="margin-right: 8px;">📝</span> Additional Message
          </h3>
          <p style="margin: 0; color: ${colors.text}; line-height: 1.6; font-size: 16px; font-style: italic;">${messageB}</p>
        </div>
        ` : ''}

        ${deviceInfo ? `
        <div style="background: linear-gradient(135deg, #EBF8FF 0%, #BEE3F8 100%); margin: 0 20px 20px 20px; padding: 25px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          <h3 style="margin: 0 0 20px 0; color: #2B6CB0; font-size: 18px; display: flex; align-items: center;">
            <span style="margin-right: 8px;">📱</span> Device Information
          </h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div><strong style="color: #2B6CB0;">Device:</strong> ${deviceInfo.device}</div>
            <div><strong style="color: #2B6CB0;">Browser:</strong> ${deviceInfo.browser}</div>
            <div><strong style="color: #2B6CB0;">OS:</strong> ${deviceInfo.os}</div>
            <div><strong style="color: #2B6CB0;">Screen:</strong> ${deviceInfo.screenResolution}</div>
            <div><strong style="color: #2B6CB0;">Language:</strong> ${deviceInfo.language}</div>
            <div><strong style="color: #2B6CB0;">Timezone:</strong> ${deviceInfo.timezone}</div>
          </div>
        </div>
        ` : ''}

        ${locationInfo ? `
        <div style="background: linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%); margin: 0 20px 20px 20px; padding: 25px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          <h3 style="margin: 0 0 20px 0; color: #6B46C1; font-size: 18px; display: flex; align-items: center;">
            <span style="margin-right: 8px;">📍</span> Location Information
          </h3>
          ${locationInfo.error ? 
            `<div style="background: #FEE2E2; padding: 15px; border-radius: 10px; color: #DC2626;">
              <strong>Error:</strong> ${locationInfo.error}
            </div>` :
            `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div><strong style="color: #6B46C1;">City:</strong> ${locationInfo.city || 'Unknown'}</div>
              <div><strong style="color: #6B46C1;">Country:</strong> ${locationInfo.country || 'Unknown'}</div>
              <div><strong style="color: #6B46C1;">Coordinates:</strong> ${locationInfo.latitude?.toFixed(6) || 'N/A'}, ${locationInfo.longitude?.toFixed(6) || 'N/A'}</div>
              <div><strong style="color: #6B46C1;">Accuracy:</strong> ±${locationInfo.accuracy?.toFixed(0) || 'N/A'} meters</div>
            </div>`
          }
        </div>
        ` : ''}

        <!-- Footer -->
        <div style="background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%); padding: 25px 20px; text-align: center;">
          <p style="margin: 0; color: ${colors.white}; font-size: 14px; font-weight: 500;">
            💕 Sent with love from Cylvenda Valentine App 💕
          </p>
          <p style="margin: 10px 0 0 0; color: ${colors.white}; font-size: 12px; opacity: 0.8;">
            Making Valentine's Day memorable, one response at a time
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
      return res.status(500).json({ error: 'Failed to send email' });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully',
      id: data.id 
    });

  } catch (error) {
    console.error('Function error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
