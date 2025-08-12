import React, { useEffect, useRef, useState } from 'react';
import { View, SizableText, Image, YStack, XStack, Button } from '@my/ui';
import { Eye, Download, Share2 } from '@tamagui/lucide-icons';

interface TicketNFT3DWebProps {
  nftURL: string;
  title: string;
  onView?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

export const TicketNFT3DWeb: React.FC<TicketNFT3DWebProps> = ({
  nftURL,
  title,
  onView,
  onDownload,
  onShare,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isThreeJSLoaded, setIsThreeJSLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const threeContainerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const meshRef = useRef<any>(null);

  // Dynamically load Three.js
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadThreeJS = async () => {
      try {
        const THREE = await import('three');
        setIsThreeJSLoaded(true);

        // Initialize Three.js scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 300 / 400, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(300, 400);
        renderer.setClearColor(0x000000, 0);

        if (threeContainerRef.current) {
          threeContainerRef.current.appendChild(renderer.domElement);
        }

        // Create a plane geometry for the NFT
        const geometry = new THREE.PlaneGeometry(2.5, 3.5);
        const texture = new THREE.TextureLoader().load(nftURL);
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.9,
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        camera.position.z = 3;

        sceneRef.current = scene;
        rendererRef.current = renderer;
        meshRef.current = mesh;

        // Animation loop
        const animate = () => {
          requestAnimationFrame(animate);

          if (meshRef.current) {
            meshRef.current.rotation.x = rotation.x * 0.01;
            meshRef.current.rotation.y = rotation.y * 0.01;
          }

          renderer.render(scene, camera);
        };

        animate();
      } catch (error) {
        console.warn('Three.js not available, falling back to CSS 3D');
        setIsThreeJSLoaded(false);
      }
    };

    loadThreeJS();

    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [nftURL]);

  // Handle mouse movement for 3D effect
  useEffect(() => {
    if (!containerRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const rotateX = (e.clientY - centerY) / 20;
      const rotateY = (e.clientX - centerX) / 20;

      setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
      setRotation({ x: 0, y: 0 });
      setIsHovered(false);
    };

    const container = containerRef.current;
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseenter', () => setIsHovered(true));

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseenter', () => setIsHovered(true));
    };
  }, []);

  const webStyles = {
    transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
    transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.3s ease-out',
    transformStyle: 'preserve-3d' as const,
  };

  const cardStyles = {
    transform: 'translateZ(20px)',
    boxShadow: isHovered
      ? '0 20px 40px rgba(0,0,0,0.3), 0 0 20px rgba(0,0,0,0.1)'
      : '0 10px 30px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease-out',
  };

  return (
    <View
      ref={containerRef as any}
      style={webStyles}
      padding="$4"
      alignItems="center"
      justifyContent="center"
    >
      <YStack
        width={300}
        height={400}
        backgroundColor="$background"
        borderRadius="$4"
        borderWidth={2}
        borderColor="$borderColor"
        overflow="hidden"
        style={cardStyles}
        shadowColor="$shadowColor"
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.3}
        shadowRadius={8}
        elevation={8}
      >
        {/* NFT Image Container */}
        <View flex={1} position="relative" overflow="hidden" backgroundColor="$color2">
          {isThreeJSLoaded ? (
            <View ref={threeContainerRef as any} width="100%" height="100%" position="relative" />
          ) : (
            <Image
              source={{ uri: nftURL }}
              width="100%"
              height="100%"
              resizeMode="cover"
              // fallback prop not supported on all platforms
            />
          )}

          {/* Glossy overlay effect */}
          <View
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            background="linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%)"
            pointerEvents="none"
          />
        </View>

        {/* Ticket Info */}
        <YStack padding="$3" backgroundColor="$background" gap="$2">
          <SizableText size="$4" fontWeight="600" numberOfLines={2} textAlign="center">
            {title}
          </SizableText>

          {/* Action Buttons */}
          <XStack gap="$2" justifyContent="center">
            {onView && (
              <Button size="$2" theme="blue" onPress={onView} icon={<Eye size={16} />}>
                <Button.Text>View</Button.Text>
              </Button>
            )}

            {onDownload && (
              <Button size="$2" theme="green" onPress={onDownload} icon={<Download size={16} />}>
                <Button.Text>Download</Button.Text>
              </Button>
            )}

            {onShare && (
              <Button size="$2" theme="orange" onPress={onShare} icon={<Share2 size={16} />}>
                <Button.Text>Share</Button.Text>
              </Button>
            )}
          </XStack>
        </YStack>
      </YStack>
    </View>
  );
};

export default TicketNFT3DWeb;
