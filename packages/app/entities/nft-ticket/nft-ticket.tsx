'use client';
import { View, Image, YStack, Text, XStack } from '@my/ui';
import { OrbitControls, Html } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { LinearGradient } from 'tamagui/linear-gradient';
import type * as THREE from 'three';

export type TicketStyle = 'normal' | 'silver' | 'gold' | 'copper';

interface NFTTicketProps {
  // Event details
  eventName?: string;
  eventImageUrl?: string;
  startDate?: Date;
  ticketType?: string;
  location?: string;
  locationDetails?: string;

  // Ticket holder details
  ticketHolderName?: string;
  ticketHolderUsername?: string;
  ticketHolderAvatar?: string;

  // Organizer details
  organizerName?: string;
  organizerEmail?: string;
  organizerAvatar?: string;

  // Blockchain details
  tokenId?: string;
  qrCodeData?: string;

  style?: TicketStyle;
}

const getStyleConfig = (style: TicketStyle) => {
  switch (style) {
    case 'silver':
      return {
        background: `
          linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 75%, #64748b 100%),
          linear-gradient(45deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 50%, rgba(0,0,0,0.1) 100%)
        `,
        shimmer:
          'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
        textColor: 'text-slate-900',
        labelColor: 'text-slate-700',
        subtleColor: 'text-slate-800',
        borderColor: 'border-slate-500',
        middleColor: 'bg-slate-500',
        middleColor2: 'bg-slate-400',
      };
    case 'gold':
      return {
        background: `
          linear-gradient(135deg, #fef3c7 0%, #f59e0b 25%, #d97706 50%, #b45309 75%, #92400e 100%),
          linear-gradient(45deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 50%, rgba(0,0,0,0.1) 100%)
        `,
        shimmer:
          'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)',
        textColor: 'text-yellow-950',
        labelColor: 'text-yellow-900',
        subtleColor: 'text-yellow-950',
        borderColor: 'border-amber-700',
        middleColor: 'bg-amber-600',
        middleColor2: 'bg-amber-500',
      };
    case 'copper':
      return {
        background: `
          linear-gradient(135deg, #fed7aa 0%, #ea580c 25%, #c2410c 50%, #9a3412 75%, #7c2d12 100%),
          linear-gradient(45deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 50%, rgba(0,0,0,0.1) 100%)
        `,
        shimmer:
          'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
        textColor: 'text-red-950',
        labelColor: 'text-red-900',
        subtleColor: 'text-red-950',
        borderColor: 'border-orange-700',
        middleColor: 'bg-orange-600',
        middleColor2: 'bg-orange-500',
      };
    default: // normal - now white
      return {
        background: `
          linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #f1f5f9 50%, #e2e8f0 75%, #cbd5e1 100%)
        `,
        shimmer:
          'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.8) 50%, transparent 70%)',
        textColor: 'text-gray-900',
        labelColor: 'text-gray-600',
        subtleColor: 'text-gray-700',
        borderColor: 'border-gray-400',
        middleColor: 'bg-gray-300',
        middleColor2: 'bg-gray-200',
      };
  }
};

function TicketMesh({
  eventName = 'Sample Event',
  eventImageUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tothemoon.jfif-zeYcehghP0BZmqpePzre0PLh7EyBCE.jpeg',
  startDate = new Date(),
  ticketType = 'General Admission',
  location = 'Virtual Event',
  locationDetails = 'Online Platform',
  ticketHolderName = 'John Doe',
  ticketHolderUsername = '@johndoe',
  ticketHolderAvatar,
  organizerName = 'Event Organizers',
  organizerEmail = 'contact@eventorganizers.com',
  organizerAvatar,
  tokenId = '#EVT001',
  qrCodeData,
  style = 'normal', // Added style prop with default
}: NFTTicketProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [flipped, setFlipped] = useState(false);

  const styleConfig = getStyleConfig(style);

  const formatDate = (date: Date) => {
    const day = date.getDate().toString();
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const [timeStr, period] = time.split(' ');
    const timezone =
      Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')[1]?.toUpperCase() || 'UTC';

    return { day, month, weekday, timeStr, period, timezone };
  };

  const { day, month, weekday, timeStr, period, timezone } = formatDate(startDate);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const qrUrl =
    qrCodeData ||
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      `NFT-TICKET:${tokenId}:${eventName}:${startDate.toISOString()}`
    )}`;

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

      // Smooth flip animation using lerp
      const targetRotation = flipped ? Math.PI : 0;
      meshRef.current.rotation.y += (targetRotation - meshRef.current.rotation.y) * 0.1;
    }
  });

  const handleClick = () => {
    setFlipped(!flipped);
  };

  return (
    <group ref={meshRef} onClick={handleClick}>
      {/* Front Face */}
      <Html
        transform
        occlude="blending"
        position={[0, 0, 0.02]}
        style={{
          width: '280px',
          height: '550px',
          pointerEvents: 'none',
          fontSize: '14px',
          fontSmooth: 'always',
          WebkitFontSmoothing: 'antialiased',
          textRendering: 'optimizeLegibility',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
        }}
      >
        <div
          className={`w-full h-full rounded-2xl ${styleConfig.textColor} shadow-2xl relative overflow-hidden flex flex-col`}
          style={{
            background: styleConfig.background,
            boxShadow: `
                 inset 0 1px 0 rgba(255,255,255,0.9),
                 inset 0 -1px 0 rgba(0,0,0,0.1),
                 inset 1px 0 0 rgba(255,255,255,0.5),
                 inset -1px 0 0 rgba(0,0,0,0.1),
                 0 10px 25px rgba(0,0,0,0.3),
                 0 5px 10px rgba(0,0,0,0.2)
               `,
          }}
        >
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: styleConfig.shimmer,
              animation: 'shimmer 3s ease-in-out',
            }}
          ></div>

          <div className="absolute -left-2 top-[52%] transform -translate-y-1/2 w-4 h-4 bg-gray-900 rounded-full shadow-lg"></div>
          <div className="absolute -right-2 top-[52%] transform -translate-y-1/2 w-4 h-4 bg-gray-900 rounded-full shadow-lg"></div>

          {/* Event Image - Top half, 1:1 aspect ratio */}
          <div className="p-3 pb-1 relative z-10">
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-800 mb-2 shadow-inner">
              <img
                src={eventImageUrl || '/placeholder.svg'}
                alt="Event"
                className="w-full h-full object-cover"
                style={{ userSelect: 'none', pointerEvents: 'none' }}
              />
            </div>
          </div>

          <div className="mx-3 my-1 relative z-10">
            <div className={`border-t-2 border-dashed ${styleConfig.borderColor} opacity-60`}></div>
          </div>

          <div className="px-3 pb-2 relative z-10">
            <h1
              className={`text-lg font-black text-center mb-2 leading-tight ${styleConfig.textColor} drop-shadow-sm tracking-wide uppercase`}
            >
              {eventName}
            </h1>
          </div>

          <div className="px-3 pb-3 space-y-4 flex-1 relative z-10">
            {/* Date and Time Row */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div
                  className={`text-[10px] ${styleConfig.labelColor} font-medium mb-0.5 uppercase tracking-wide`}
                >
                  DATE
                </div>
                <div className="flex items-start space-x-1">
                  <div className={`text-3xl font-black ${styleConfig.textColor} leading-none`}>
                    {day}
                  </div>
                  <div className="flex flex-col leading-none">
                    <div className={`text-xs font-bold ${styleConfig.textColor}`}>{month}</div>
                    <div className={`text-[10px] ${styleConfig.subtleColor}`}>{weekday}</div>
                  </div>
                </div>
              </div>
              <div>
                <div
                  className={`text-[10px] ${styleConfig.labelColor} font-medium mb-0.5 uppercase tracking-wide`}
                >
                  TIME
                </div>
                <div className="flex items-start space-x-1">
                  <div className={`text-3xl font-black ${styleConfig.textColor} leading-none`}>
                    {timeStr}
                  </div>
                  <div className="flex flex-col leading-none">
                    <div className={`text-xs font-bold ${styleConfig.textColor}`}>{period}</div>
                    <div className={`text-[10px] ${styleConfig.subtleColor}`}>{timezone}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div
                  className={`text-[10px] ${styleConfig.labelColor} font-medium mb-0.5 uppercase tracking-wide`}
                >
                  TICKET
                </div>
                <div className={`text-sm font-bold ${styleConfig.textColor}`}>{ticketType}</div>
              </div>
              <div>
                <div
                  className={`text-[10px] ${styleConfig.labelColor} font-medium mb-0.5 uppercase tracking-wide`}
                >
                  VENUE
                </div>
                <div className={`text-sm font-bold ${styleConfig.textColor}`}>{location}</div>
                {locationDetails && (
                  <div className={`text-xs ${styleConfig.subtleColor}`}>{locationDetails}</div>
                )}
              </div>
            </div>

            <div className="pt-1">
              <div
                className={`text-[10px] ${styleConfig.labelColor} font-medium mb-1.5 uppercase tracking-wide`}
              >
                TICKET HOLDER
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                  {ticketHolderAvatar ? (
                    <img
                      src={ticketHolderAvatar || '/placeholder.svg'}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-xs font-bold">
                      {getInitials(ticketHolderName)}
                    </span>
                  )}
                </div>
                <div>
                  <div className={`text-sm font-bold ${styleConfig.textColor}`}>
                    {ticketHolderUsername}
                  </div>
                  <div className={`text-xs ${styleConfig.subtleColor}`}>Verified Owner</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Html>

      {/* Gray Middle Face 1 */}
      <Html
        transform
        occlude="blending"
        position={[0, 0, 0.01]}
        style={{
          width: '280px',
          height: '550px',
          pointerEvents: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
        }}
      >
        <div className={`w-full h-full ${styleConfig.middleColor} rounded-2xl relative`}>
          <div className="absolute -left-2 top-[52%] transform -translate-y-1/2 w-4 h-4 bg-gray-900 rounded-full shadow-lg"></div>
          <div className="absolute -right-2 top-[52%] transform -translate-y-1/2 w-4 h-4 bg-gray-900 rounded-full shadow-lg"></div>
        </div>
      </Html>

      {/* Gray Middle Face 2 */}
      <Html
        transform
        occlude="blending"
        position={[0, 0, -0.01]}
        style={{
          width: '280px',
          height: '550px',
          pointerEvents: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
        }}
      >
        <div className={`w-full h-full ${styleConfig.middleColor} rounded-2xl relative`}>
          <div className="absolute -left-2 top-[52%] transform -translate-y-1/2 w-4 h-4 bg-gray-900 rounded-full shadow-lg"></div>
          <div className="absolute -right-2 top-[52%] transform -translate-y-1/2 w-4 h-4 bg-gray-900 rounded-full shadow-lg"></div>
        </div>
      </Html>

      {/* Gray Middle Face 3 */}
      <Html
        transform
        occlude="blending"
        position={[0, 0, 0]}
        style={{
          width: '280px',
          height: '550px',
          pointerEvents: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
        }}
      >
        <div className={`w-full h-full ${styleConfig.middleColor2} rounded-2xl relative`}>
          <div className="absolute -left-2 top-[52%] transform -translate-y-1/2 w-4 h-4 bg-gray-900 rounded-full shadow-lg"></div>
          <div className="absolute -right-2 top-[52%] transform -translate-y-1/2 w-4 h-4 bg-gray-900 rounded-full shadow-lg"></div>
        </div>
      </Html>

      {/* Back Face */}
      <Html
        transform
        occlude="blending"
        position={[0, 0, -0.02]}
        rotation={[0, Math.PI, 0]}
        style={{
          width: '280px',
          height: '550px',
          pointerEvents: 'none',
          fontSize: '14px',
          fontSmooth: 'always',
          WebkitFontSmoothing: 'antialiased',
          textRendering: 'optimizeLegibility',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
        }}
      >
        <div
          className={`w-full h-full rounded-2xl ${styleConfig.textColor} shadow-2xl relative overflow-hidden flex flex-col`}
          style={{
            background: styleConfig.background,
            boxShadow: `
                 inset 0 1px 0 rgba(255,255,255,0.9),
                 inset 0 -1px 0 rgba(0,0,0,0.1),
                 inset 1px 0 0 rgba(255,255,255,0.5),
                 inset -1px 0 0 rgba(0,0,0,0.1),
                 0 10px 25px rgba(0,0,0,0.3),
                 0 5px 10px rgba(0,0,0,0.2)
               `,
          }}
        >
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: styleConfig.shimmer,
              animation: 'shimmer 3s ease-in-out',
            }}
          ></div>

          <div className="absolute -left-2 top-[52%] transform -translate-y-1/2 w-4 h-4 bg-gray-900 rounded-full shadow-lg"></div>
          <div className="absolute -right-2 top-[52%] transform -translate-y-1/2 w-4 h-4 bg-gray-900 rounded-full shadow-lg"></div>

          <div className="p-3 pb-1 relative z-10">
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-white mb-2 shadow-inner border border-gray-300 flex items-center justify-center">
              <img
                src={qrUrl || '/placeholder.svg'}
                alt="QR Code for ticket verification"
                className="w-full h-full object-contain p-4"
                style={{ userSelect: 'none', pointerEvents: 'none' }}
              />
            </div>
          </div>

          <div className="mx-3 my-1 relative z-10">
            <div className={`border-t-2 border-dashed ${styleConfig.borderColor} opacity-60`}></div>
          </div>

          <div className="px-3 pb-3 flex-1 relative z-10">
            <div className="h-full flex flex-col space-y-4">
              {/* Verification Section */}
              <div className="text-center">
                <div
                  className={`text-[10px] ${styleConfig.labelColor} font-medium mb-1 uppercase tracking-wide`}
                >
                  VERIFICATION
                </div>
                <div className={`text-xs font-bold ${styleConfig.textColor} mb-1`}>
                  BLOCKCHAIN CERTIFIED
                </div>
                <div className={`text-[10px] ${styleConfig.subtleColor}`}>Token ID: {tokenId}</div>
              </div>

              {/* Event Organizer */}
              <div>
                <div
                  className={`text-[10px] ${styleConfig.labelColor} font-medium mb-1 uppercase tracking-wide`}
                >
                  ORGANIZER
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  {organizerAvatar && (
                    <div className="w-4 h-4 rounded-full overflow-hidden">
                      <img
                        src={organizerAvatar || '/placeholder.svg'}
                        alt="Organizer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className={`text-xs font-bold ${styleConfig.textColor}`}>
                    {organizerName}
                  </div>
                </div>
                <div className={`text-[10px] ${styleConfig.subtleColor}`}>{organizerEmail}</div>
              </div>

              {/* Terms */}
              <div className="flex-1">
                <div
                  className={`text-[10px] ${styleConfig.labelColor} font-medium mb-1 uppercase tracking-wide`}
                >
                  TERMS
                </div>
                <div className={`text-[10px] ${styleConfig.subtleColor} leading-relaxed space-y-1`}>
                  <p>• Non-transferable without blockchain verification</p>
                  <p>• Valid for single use only</p>
                  <p>• Subject to event terms & conditions</p>
                  <p>• Refunds available up to 24hrs before event</p>
                </div>
              </div>

              {/* Footer */}
              <div className={`pt-2 border-t ${styleConfig.borderColor} border-dashed`}>
                <div className="text-center">
                  <div className={`text-[10px] ${styleConfig.labelColor} font-medium`}>
                    POWERED BY NFT TECHNOLOGY
                  </div>
                  <div className={`text-[8px] ${styleConfig.subtleColor} mt-0.5`}>
                    Secure • Authentic • Verifiable
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}

export default function NFTTicket(props: NFTTicketProps) {
  return (
    <div className="w-full h-screen bg-gray-900">
      <Canvas camera={{ position: [0, 0, 30], fov: 40 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <pointLight position={[-10, -10, -10]} intensity={0.8} />
        <TicketMesh {...props} />
        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={18}
          maxDistance={40}
          autoRotate={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-white/60 text-sm">
        <div>🖱️ Drag horizontally to rotate • 🔍 Scroll to zoom • 👆 Click to flip</div>
      </div>
    </div>
  );
}
