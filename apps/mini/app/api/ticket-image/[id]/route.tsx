import { api } from '@my/backend/_generated/api';
import { Id } from '@my/backend/_generated/dataModel';
import { fetchQuery } from '@my/backend/nextjs';
import { formatDate, formatRelativeDate } from '@my/ui/src/lib/dates';
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
            width: '1200px',
            height: '630px',
            display: 'flex',
            flexDirection: 'row',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            overflow: 'hidden',
          }}
        >
          {/* Left Section - Dark with Neon Text */}
          <div
            style={{
              width: '50%',
              height: '100%',
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              padding: '40px',
            }}
          >
            {/* Ticket Image */}
            <img
              src={ticket.eventImageUrl}
              alt="Ticket"
              style={{
                width: '90%',
                maxWidth: '420px',
                maxHeight: '520px',
                borderRadius: '24px',
                boxShadow: '0 8px 32px rgba(30,41,59,0.18), 0 1.5px 6px rgba(0,0,0,0.08)',
                objectFit: 'cover',
                border: '4px solid #e2e8f0',
                background: '#f1f5f9',
              }}
            />
          </div>

          {/* Right Section - Light with Ticket Details */}
          <div
            style={{
              width: '50%',
              height: '100%',
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              display: 'flex',
              flexDirection: 'column',
              padding: '40px',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `
                radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)
              `,
                display: 'flex',
              }}
            />

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                zIndex: 1,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: '50px',
                }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#64748b',
                    marginBottom: '8px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  TICKET
                </span>
                <h2
                  style={{
                    fontSize: '42px',
                    fontWeight: '800',
                    color: 'black',
                    margin: '0',
                    textAlign: 'center',
                    letterSpacing: '-0.02em',
                    lineHeight: '1.1',
                  }}
                >
                  {ticket.ticketName}
                </h2>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '32px',
                  width: '100%',
                  maxWidth: '450px',
                }}
              >
                {/* First Row - Date and Event */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      flex: 1,
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#64748b',
                        marginBottom: '8px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      DATE
                    </span>
                    <span
                      style={{
                        fontSize: '24px',
                        fontWeight: '800',
                        color: 'black',
                        lineHeight: '1.1',
                      }}
                    >
                      {formatDate(formatRelativeDate(ticket.startDate))}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      flex: 1,
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#64748b',
                        marginBottom: '8px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      EVENT
                    </span>
                    <span
                      style={{
                        fontSize: '24px',
                        fontWeight: '800',
                        color: 'black',
                        lineHeight: '1.1',
                        textAlign: 'right',
                      }}
                    >
                      {ticket.eventName}
                    </span>
                  </div>
                </div>

                {/* Second Row - Ticket Type and Venue */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      flex: 1,
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#64748b',
                        marginBottom: '8px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      LOCATION
                    </span>
                    <span
                      style={{
                        fontSize: '24px',
                        fontWeight: '800',
                        color: 'black',
                        lineHeight: '1.1',
                      }}
                    >
                      {ticket.location}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      flex: 1,
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#64748b',
                        marginBottom: '8px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      VENUE
                    </span>
                    <span
                      style={{
                        fontSize: '24px',
                        fontWeight: '800',
                        color: 'black',
                        lineHeight: '1.1',
                        textAlign: 'right',
                      }}
                    >
                      {ticket.locationDetails}
                    </span>
                  </div>
                </div>

                {/* Third Row - Ticket Holder (centered) */}

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginTop: '20px',
                    padding: '16px 0',
                    borderTop: '1px solid #cbd5e1',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                    }}
                  >
                    {ticket.ticketHolder.avatar ? (
                      <img
                        src={ticket.ticketHolder.avatar || '/placeholder.svg'}
                        alt="Avatar"
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: '700',
                        }}
                      >
                        {ticket.ticketHolder.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1e293b',
                        lineHeight: '1.2',
                      }}
                    >
                      {ticket.ticketHolder.name}
                    </span>
                  </div>
                </div>
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
