import { api } from '@my/backend/_generated/api';
import { Id } from '@my/backend/_generated/dataModel';
import { fetchQuery } from '@my/backend/nextjs';
import { ImageResponse } from '@vercel/og';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Fetch ticket data
    const ticket = await fetchQuery(api.registrations.getRegistrationTicketByIdMetadata, {
      registrationId: id as Id<'registrations'>,
    });

    if (!ticket) {
      return new NextResponse('Ticket not found', { status: 404 });
    }

    // Generate the image using @vercel/og
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '40px',
            fontFamily: 'Inter, system-ui, sans-serif',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              right: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              opacity: 0.3,
            }}
          />

          {/* Header Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              padding: '32px',
              marginBottom: '32px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <h1
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#1f2937',
                textAlign: 'center',
                margin: '0 0 20px 0',
                lineHeight: '1.2',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              {ticket.eventName}
            </h1>
            <div
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                border: 'none',
                borderRadius: '16px',
                padding: '12px 24px',
                fontSize: '20px',
                fontWeight: '700',
                color: 'white',
                boxShadow: '0 8px 16px rgba(245, 158, 11, 0.3)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {ticket.ticketName}
            </div>
          </div>

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              gap: '20px',
              justifyContent: 'space-between',
            }}
          >
            {/* Date and Time Section */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: '24px',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  padding: '20px',
                  borderRadius: '16px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '90px',
                  textAlign: 'center',
                  boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
                }}
              >
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: 'rgba(255, 255, 255, 0.9)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  {new Date(ticket.startDate).toLocaleDateString('en-US', { month: 'short' })}
                </div>
                <div
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: 'white',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {new Date(ticket.startDate).getDate()}
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: '600',
                  }}
                >
                  {new Date(ticket.startDate).getFullYear()}
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#1f2937',
                    marginBottom: '8px',
                  }}
                >
                  {new Date(ticket.startDate).toLocaleDateString('en-US', { weekday: 'long' })}
                </div>
                <div
                  style={{
                    fontSize: '18px',
                    color: '#6b7280',
                    fontWeight: '500',
                  }}
                >
                  {new Date(ticket.startDate).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </div>
              </div>
            </div>

            {/* Info Sections */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              {/* Location Section */}
              {ticket.location && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    padding: '20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        marginBottom: '6px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Location
                    </div>
                    <div
                      style={{
                        fontSize: '18px',
                        color: '#1f2937',
                        fontWeight: '600',
                      }}
                    >
                      {ticket.location}
                    </div>
                  </div>
                </div>
              )}

              {/* Ticket Holder Section */}
              {ticket.ticketHolder?.name && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    padding: '20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        marginBottom: '6px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Ticket Holder
                    </div>
                    <div
                      style={{
                        fontSize: '18px',
                        color: '#1f2937',
                        fontWeight: '600',
                      }}
                    >
                      {ticket.ticketHolder.name}
                    </div>
                  </div>
                </div>
              )}

              {/* Organizer Section */}
              {ticket.organizer?.name && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    padding: '20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        marginBottom: '6px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Organized by
                    </div>
                    <div
                      style={{
                        fontSize: '18px',
                        color: '#1f2937',
                        fontWeight: '600',
                      }}
                    >
                      {ticket.organizer.name}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                textAlign: 'center',
                padding: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '16px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div
                style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Powered by Mint Up
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating ticket image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
