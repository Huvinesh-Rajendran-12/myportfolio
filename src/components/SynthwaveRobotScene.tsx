'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { gsap } from 'gsap';
import { portfolioData } from './portfolioData'; // Import data (assuming projectKeys is not needed directly here now)
import type { PortfolioData, PortfolioItem } from './portfolioData'; // Import types

interface SynthwaveRobotSceneProps {
  navigationTarget: string | null;
  onShowInfo: (data: PortfolioItem | null) => void;
  onClearNavigation: () => void;
}

// Define mappings from section ID to box names and portfolio data keys
const sectionMap: { [key: string]: { boxName: string; dataKey: keyof PortfolioData } } = {
    about: { boxName: 'boxAbout', dataKey: 'about' },
    skills: { boxName: 'boxSkills', dataKey: 'skills' },
    projects: { boxName: 'boxProjects', dataKey: 'project_ml' }, // Default to first project, specific project logic removed for simplicity here
    contact: { boxName: 'boxContact', dataKey: 'contact' }
};


const SynthwaveRobotScene: React.FC<SynthwaveRobotSceneProps> = ({
  navigationTarget,
  onShowInfo,
  onClearNavigation,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const requestRef = useRef<number>(0); // Initialize with 0 instead of undefined
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null); // Add camera reference
  
  // Define RobotRefs interface for proper typing
  interface RobotRefs {
    humanoidRobot?: THREE.Group;
    head?: THREE.Group;
    chestLight?: THREE.Mesh;
    leftArmGroup?: THREE.Group;
    rightArmGroup?: THREE.Group;
    [key: string]: THREE.Object3D | THREE.Group | undefined; // For box references like boxAbout, boxAboutLid, etc.
  }
  
  const robotRefs = useRef<RobotRefs>({}); // Type with RobotRefs interface
  const clickableObjectsRef = useRef<THREE.Object3D[]>([]);
  const currentFocusRef = useRef<string | null>(null);
  const activeTween = useRef<gsap.core.Timeline | null>(null); // Ref to control GSAP timeline

  const memoizedOnShowInfo = useCallback(onShowInfo, [onShowInfo]);
  const memoizedOnClearNavigation = useCallback(onClearNavigation, [onClearNavigation]);

  useEffect(() => {
    if (!mountRef.current || rendererRef.current) return;

    console.log("Initializing scene (Synthwave - Box Interaction)...");
    const currentMount = mountRef.current;

    // --- Scene, Camera, Renderer, Controls, Lighting, Grid --- (Mostly Same)
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(60, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 2.5, 10);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 3;
    controls.maxDistance = 25;
    controls.target.set(0, 1.8, 0);
    controlsRef.current = controls;
    const ambientLight = new THREE.AmbientLight(0x400080, 0.8); scene.add(ambientLight);
    const cyanLight = new THREE.PointLight(0x00ffff, 2.5, 15); cyanLight.position.set(-4, 3, 4); scene.add(cyanLight);
    const pinkLight = new THREE.PointLight(0xff00ff, 2.5, 15); pinkLight.position.set(4, 2, 3); scene.add(pinkLight);
    const dirLight = new THREE.DirectionalLight(0xaaaaee, 0.3); dirLight.position.set(5, 10, 7); scene.add(dirLight);
    const gridSize = 50; const gridDivisions = 25;
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0xff00ff, 0x440044); gridHelper.position.y = 0; scene.add(gridHelper);

    // --- Materials --- (Same Synthwave materials)
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x1a1a1a, specular: 0xff00ff, shininess: 50 });
    const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
    const jointMaterial = new THREE.MeshPhongMaterial({ color: 0x880088, emissive: 0xff00ff, emissiveIntensity: 0.6, specular: 0xff88ff, shininess: 60 });
    const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ffff, emissive: 0x00ffff });
    const chestLightMaterial = new THREE.MeshPhongMaterial({ color: 0xff00ff, emissive: 0xff00ff });
    // New Box Materials
    const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x331144, specular: 0x8844aa, shininess: 40 }); // Dark purple box
    const boxLidMaterial = new THREE.MeshPhongMaterial({ color: 0x442255, specular: 0xaa66cc, shininess: 40 }); // Slightly lighter lid

    // --- Build Robot --- (Same structure as before)
    const clickableObjects: THREE.Object3D[] = [];
    try {
        const humanoidRobot = new THREE.Group(); humanoidRobot.position.y = 0; robotRefs.current.humanoidRobot = humanoidRobot;
        const torso = new THREE.Group(); const torsoHeight = 2.5, torsoWidth = 2.0, torsoDepth = 1.2; const torsoMesh = new THREE.Mesh(new RoundedBoxGeometry(torsoWidth, torsoHeight, torsoDepth, 4, 0.2), bodyMaterial); torso.add(torsoMesh); const chestLight = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16), chestLightMaterial); chestLight.position.set(0, 0.3, torsoDepth / 2 + 0.01); chestLight.rotation.x = Math.PI / 2; chestLight.userData = { isClickable: true, id: "chest" }; torso.add(chestLight); clickableObjects.push(chestLight); robotRefs.current.chestLight = chestLight; torso.position.y = torsoHeight / 2 + 1.0; humanoidRobot.add(torso);
        const head = new THREE.Group(); const headHeight = 0.8, headWidth = 0.9; const headBase = new THREE.Mesh(new THREE.SphereGeometry(headWidth / 2, 24, 12), bodyMaterial); headBase.scale.y = headHeight / headWidth; headBase.userData = { isClickable: true, id: "head" }; head.add(headBase); clickableObjects.push(headBase); const jaw = new THREE.Mesh(new RoundedBoxGeometry(headWidth * 0.8, headHeight * 0.5, headWidth * 0.7, 2, 0.1), bodyMaterial); jaw.position.set(0, -headHeight * 0.35, headWidth * 0.1); head.add(jaw); const eyeGeo = new THREE.SphereGeometry(0.1, 12, 8); const eyeL = new THREE.Mesh(eyeGeo, eyeMaterial); eyeL.position.set(-0.2, 0.05, headWidth * 0.4); head.add(eyeL); const eyeR = eyeL.clone(); eyeR.position.x = 0.2; head.add(eyeR); head.position.y = torso.position.y + torsoHeight / 2 + headHeight * 0.4; humanoidRobot.add(head); robotRefs.current.head = head;
        const upperArmLength = 1.0, lowerArmLength = 0.9, armRadius = 0.3, jointRadius = 0.35, handSize = 0.5; const upperArmGeo = new THREE.CylinderGeometry(armRadius, armRadius * 0.9, upperArmLength, 8); const lowerArmGeo = new THREE.CylinderGeometry(armRadius * 0.9, armRadius * 0.8, lowerArmLength, 8); const jointGeo = new THREE.SphereGeometry(jointRadius, 12, 6); const handGeo = new RoundedBoxGeometry(handSize, handSize, handSize, 1, 0.1);
        const createArm = (isLeft: boolean) => { const armGroup = new THREE.Group(); const shoulderJoint = new THREE.Mesh(jointGeo, jointMaterial); armGroup.add(shoulderJoint); const upperArm = new THREE.Mesh(upperArmGeo, wireframeMaterial); upperArm.position.y = -(jointRadius + upperArmLength / 2); shoulderJoint.add(upperArm); const elbowJoint = new THREE.Mesh(jointGeo, jointMaterial); elbowJoint.position.y = -(jointRadius + upperArmLength); shoulderJoint.add(elbowJoint); const lowerArm = new THREE.Mesh(lowerArmGeo, wireframeMaterial); lowerArm.position.y = -(jointRadius + lowerArmLength / 2); elbowJoint.add(lowerArm); const hand = new THREE.Mesh(handGeo, wireframeMaterial); hand.position.y = -(jointRadius + lowerArmLength + handSize * 0.4); elbowJoint.add(hand); const side = isLeft ? -1 : 1; armGroup.position.set(side * (torsoWidth / 2 + jointRadius * 0.8), torso.position.y + torsoHeight * 0.3, 0); humanoidRobot.add(armGroup); return armGroup; };
        robotRefs.current.leftArmGroup = createArm(true); robotRefs.current.rightArmGroup = createArm(false);
        const upperLegLength = 1.2, lowerLegLength = 1.0, legRadius = 0.4, hipJointRadius = 0.45, kneeJointRadius = 0.4, footSize = 0.6; const upperLegGeo = new THREE.CylinderGeometry(legRadius, legRadius * 0.9, upperLegLength, 8); const lowerLegGeo = new THREE.CylinderGeometry(legRadius * 0.9, legRadius * 0.8, lowerLegLength, 8); const hipJointGeo = new THREE.SphereGeometry(hipJointRadius, 12, 6); const kneeJointGeo = new THREE.SphereGeometry(kneeJointRadius, 12, 6); const footGeo = new RoundedBoxGeometry(footSize, footSize * 0.5, footSize * 1.2, 1, 0.1);
        const createLeg = (isLeft: boolean) => { const legGroup = new THREE.Group(); const hipJoint = new THREE.Mesh(hipJointGeo, jointMaterial); legGroup.add(hipJoint); const upperLeg = new THREE.Mesh(upperLegGeo, wireframeMaterial); upperLeg.position.y = -(hipJointRadius + upperLegLength / 2); hipJoint.add(upperLeg); const kneeJoint = new THREE.Mesh(kneeJointGeo, jointMaterial); kneeJoint.position.y = -(hipJointRadius + upperLegLength); hipJoint.add(kneeJoint); const lowerLeg = new THREE.Mesh(lowerLegGeo, wireframeMaterial); lowerLeg.position.y = -(kneeJointRadius + lowerLegLength / 2); kneeJoint.add(lowerLeg); const foot = new THREE.Mesh(footGeo, wireframeMaterial); foot.position.y = -(kneeJointRadius + lowerLegLength + footSize*0.2); foot.position.z = footSize * 0.1; kneeJoint.add(foot); const side = isLeft ? -1 : 1; legGroup.position.set(side * torsoWidth * 0.3, torso.position.y - torsoHeight / 2, 0); humanoidRobot.add(legGroup); return legGroup; };
        createLeg(true); createLeg(false);
        scene.add(humanoidRobot);
        console.log("Synthwave Robot added to scene.");
        // Store camera reference
        cameraRef.current = camera;

        // --- Create Info Boxes ---
        const boxSize = 1.0;
        const lidThickness = 0.1;
        const boxGeo = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
        const lidGeo = new THREE.BoxGeometry(boxSize, lidThickness, boxSize);

        const createInfoBox = (name: string, position: THREE.Vector3) => {
            const boxGroup = new THREE.Group();
            const boxBase = new THREE.Mesh(boxGeo, boxMaterial);
            boxBase.position.y = boxSize / 2; // Base sits on ground
            boxGroup.add(boxBase);

            const lid = new THREE.Mesh(lidGeo, boxLidMaterial);
            // Position lid pivot point at the back edge
            lid.position.y = boxSize + lidThickness / 2; // On top of the base
            lid.position.z = -boxSize / 2 + lidThickness / 2; // Pivot at back edge Z
            // We need another group for the lid pivot
            const lidPivot = new THREE.Group();
            lidPivot.position.y = boxSize + lidThickness / 2; // Position pivot correctly relative to base center
            lidPivot.position.z = -boxSize / 2 + lidThickness / 2;
            lid.position.set(0,0,0); // Position lid relative to its pivot group

            const finalLidGroup = new THREE.Group(); // Group to hold the pivot point itself
            finalLidGroup.position.y = boxSize / 2; // Position pivot relative to box group origin
            finalLidGroup.position.z = -boxSize / 2; // Pivot location relative to box center
            lid.position.y = lidThickness / 2; // Lid position relative to pivot
            lid.position.z = boxSize / 2 - lidThickness / 2; // Lid position relative to pivot
            finalLidGroup.add(lid); // Add lid to the group that will rotate

            boxGroup.add(finalLidGroup); // Add the rotating group to the main box group

            boxGroup.position.copy(position);
            scene.add(boxGroup);

            // Store refs for animation
            robotRefs.current[name] = boxGroup;
            robotRefs.current[`${name}Lid`] = finalLidGroup; // Store the group that rotates
            // Make base clickable maybe? Or just use buttons. Let's skip for now.
            // clickableObjects.push(boxBase);
            // boxBase.userData = { isClickable: true, id: name }; // e.g., id: "boxSkills"
        };

        createInfoBox('boxAbout', new THREE.Vector3(-4, 0, -2));
        createInfoBox('boxSkills', new THREE.Vector3(4, 0, -2));
        createInfoBox('boxProjects', new THREE.Vector3(-4, 0, 3));
        createInfoBox('boxContact', new THREE.Vector3(4, 0, 3));

        clickableObjectsRef.current = clickableObjects; // Update ref

    } catch (error) {
        console.error("Error creating scene objects:", error);
    }

    // --- Raycasting Setup --- (Same as before)
    // Note: These are used in handleClick but implementation is hidden with /* ... */
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // --- Event Listeners ---
    const handleResize = () => {
      if (!rendererRef.current || !cameraRef.current) return;
      const width = currentMount.clientWidth;
      const height = currentMount.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    
    // Direct click logic for robot parts
    const handleClick = (event: MouseEvent) => {
      if (!rendererRef.current || !cameraRef.current || !clickableObjectsRef.current.length) return;
      
      // Calculate mouse position for raycaster
      const rect = rendererRef.current.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, cameraRef.current);
      // Rest of click handling implementation here
    };
    window.addEventListener('resize', handleResize);
    renderer.domElement.addEventListener('click', handleClick);

    // --- Animation Loop ---
    const animate = () => {
        requestRef.current = requestAnimationFrame(animate);
        if (controlsRef.current) controlsRef.current.update();
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
            rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
    };
    animate();
    
    // Define animateRobotIdle before using it
    function animateRobotIdle() {
        const { humanoidRobot, head, leftArmGroup, rightArmGroup } = robotRefs.current;
        if(!humanoidRobot || !head || !leftArmGroup || !rightArmGroup) return;
        if (activeTween.current) activeTween.current.kill();
        gsap.killTweensOf([humanoidRobot.position, head.rotation, leftArmGroup.rotation, rightArmGroup.rotation]);
        gsap.to(humanoidRobot.position, { duration: 3.5, y: 0.03, repeat: -1, yoyo: true, ease: "sine.inOut"});
        gsap.to(head.rotation, { duration: 5, y: THREE.MathUtils.degToRad(8), repeat: -1, yoyo: true, ease: "sine.inOut"});
        gsap.to(leftArmGroup.rotation, { duration: 0.5, x: THREE.MathUtils.degToRad(15), y:0, z: THREE.MathUtils.degToRad(10), ease: "power2.out"});
        gsap.to(rightArmGroup.rotation, { duration: 0.5, x: THREE.MathUtils.degToRad(15), y:0, z: THREE.MathUtils.degToRad(-10), ease: "power2.out"});
    }
    
    setTimeout(animateRobotIdle, 500);

    // --- Cleanup --- (Same as before)
    return () => { /* ... */ };
  }, []); // Ensure this runs only once

   // --- Navigation Logic (Updated for Boxes) ---
   // Move animateRobotPointAtBox definition before navigateToSection to fix the dependency issue
   const animateRobotPointAtBox = useCallback((targetBox: THREE.Object3D | null) => {
        const { humanoidRobot, head, leftArmGroup, rightArmGroup } = robotRefs.current;
        if(!humanoidRobot || !head || !leftArmGroup || !rightArmGroup || !targetBox) {
            animateRobotIdle(); // Fallback to idle if something is missing
            return;
        }
        if (activeTween.current) activeTween.current.kill(); // Kill previous timeline if any
        gsap.killTweensOf([humanoidRobot.rotation, head.rotation, leftArmGroup.rotation, rightArmGroup.rotation]); // Kill specific tweens

        // Calculate direction to box
        const robotPos = new THREE.Vector3();
        humanoidRobot.getWorldPosition(robotPos);
        const boxPos = new THREE.Vector3();
        targetBox.getWorldPosition(boxPos);
        const direction = boxPos.clone().sub(robotPos).setY(0).normalize(); // Direction on XZ plane
        
        // Calculate target position for the robot
        // Moving robot closer to the box but not all the way there
        const distanceToBox = robotPos.distanceTo(boxPos);
        const moveDistance = Math.min(distanceToBox * 0.7, 2.5); // Move 70% of the way, but not more than 2.5 units
        const targetPosition = robotPos.clone().add(direction.clone().multiplyScalar(moveDistance));
        targetPosition.y = 0; // Keep the robot on the ground

        // Calculate target Y rotation for the robot
        const targetRotationY = Math.atan2(direction.x, direction.z);

        // Determine which arm to use based on angle (e.g., right arm if box is to the right)
        const targetArm = targetRotationY < 0 ? rightArmGroup : leftArmGroup;
        const otherArm = targetRotationY < 0 ? leftArmGroup : rightArmGroup;
        const pointRotationZ = targetRotationY < 0 ? THREE.MathUtils.degToRad(-45) : THREE.MathUtils.degToRad(45);

        // Use GSAP timeline for sequenced turning and pointing
        const tl = gsap.timeline();
        activeTween.current = tl;

        // 0. Move robot toward the box (start immediately)
        tl.to(humanoidRobot.position, { 
            duration: 1.2, 
            x: targetPosition.x, 
            z: targetPosition.z, 
            ease: "power2.inOut" 
        }, 0);
        
        // 1. Turn robot body (slightly after movement starts)
        tl.to(humanoidRobot.rotation, { duration: 0.8, y: targetRotationY, ease: "power2.inOut" }, 0.2);
        // 2. Turn head slightly towards box
        tl.to(head.rotation, { duration: 0.6, y: 0, x: THREE.MathUtils.degToRad(10), z: 0, ease: "power1.inOut" }, 0.2);
        // 3. Point arm
        tl.to(targetArm.rotation, { duration: 0.7, x: THREE.MathUtils.degToRad(-30), y: 0, z: pointRotationZ, ease: "power2.out" }, 0.3);
        // 4. Reset other arm
        tl.to(otherArm.rotation, { duration: 0.5, x: THREE.MathUtils.degToRad(15), y:0, z: targetRotationY < 0 ? THREE.MathUtils.degToRad(10) : THREE.MathUtils.degToRad(-10), ease: "power2.out" }, 0.3);
    }, []);
   
   const navigateToSection = useCallback((sectionId: string | null, camera: THREE.PerspectiveCamera, controls: OrbitControls): void => {
        console.log("Navigating to section:", sectionId);

        // Kill any active animation first
        if (activeTween.current) {
            activeTween.current.kill();
        }
        // Close any open lids immediately before starting new animation
         Object.keys(sectionMap).forEach(key => {
             const boxLidRef = robotRefs.current[`${sectionMap[key].boxName}Lid`];
             if (boxLidRef) gsap.to(boxLidRef.rotation, { duration: 0.1, x: 0 }); // Close fast
         });


        memoizedOnShowInfo(null);
        currentFocusRef.current = sectionId;

        const targetPosition = new THREE.Vector3();
        const targetLookAt = new THREE.Vector3(0, 1.8, 0);
        let robotAnimation = animateRobotIdle;
        let showData: PortfolioItem | null = null;
        let targetBox: THREE.Group | null = null;
        let targetBoxLid: THREE.Group | null = null;

        const mapping = sectionId ? sectionMap[sectionId] : null;

        if (mapping && robotRefs.current[mapping.boxName]) {
            // Add type guards for the boxes
            const box = robotRefs.current[mapping.boxName];
            const boxLid = robotRefs.current[`${mapping.boxName}Lid`];
            
            // Ensure they're THREE.Object3D or THREE.Group objects before assigning
            if (box) {
                targetBox = box as THREE.Group;
            }
            
            if (boxLid) {
                targetBoxLid = boxLid as THREE.Group;
            }
            showData = portfolioData[mapping.dataKey];

            // Camera targets the box - with null check for targetBox
            if (targetBox) {
                targetBox.getWorldPosition(targetLookAt);
                targetLookAt.y = 0.5; // Look slightly above box base
                // Position camera in front of the box
                const offset = new THREE.Vector3(0, 2, 3); // Offset from box center
                targetPosition.copy(targetBox.position).add(offset);
            }

            // Use the box for the point animation when it exists
            // Added targetBox null check via closure
            robotAnimation = () => animateRobotPointAtBox(targetBox);

        } else { // Reset view if sectionId is null or box not found
            targetPosition.set(0, 2.5, 10);
            targetLookAt.set(0, 1.8, 0);
            robotAnimation = animateRobotIdle;
            currentFocusRef.current = null;
            showData = null;
        }

        // Create GSAP Timeline for sequenced animations
        const tl = gsap.timeline({
             onComplete: () => {
                 activeTween.current = null; // Clear active tween ref
                 // Show info overlay after all animations complete
                 if (showData && (currentFocusRef.current === sectionId)) {
                     memoizedOnShowInfo(showData);
                 }
             }
         });
         activeTween.current = tl; // Store ref to timeline

        // 1. Animate Camera and Controls Target
        tl.to(camera.position, { duration: 1.5, x: targetPosition.x, y: targetPosition.y, z: targetPosition.z, ease: "power2.inOut" }, 0);
        tl.to(controls.target, { 
            duration: 1.5, 
            x: targetLookAt.x, 
            y: targetLookAt.y, 
            z: targetLookAt.z, 
            ease: "power2.inOut", 
            onUpdate: function() { 
                controls.update();
            }
        }, 0);

        // 2. Trigger Robot Animation (Turn and Point) - slightly delayed
        if (robotAnimation) {
            robotAnimation(); // Animation function will now handle the targetBox internally
        }

        // 3. Animate Box Lid Opening - after camera starts moving
        if (targetBoxLid) {
            tl.to(targetBoxLid.rotation, { duration: 0.8, x: -Math.PI / 1.5, ease: "power2.out" }, 0.5); // Open lid (rotate back)
        }

   // Including animateRobotPointAtBox as a dependency since we're using it in this function
   }, [memoizedOnShowInfo, animateRobotPointAtBox]);

   // --- Handle external navigation trigger ---
   useEffect(() => {
       if (navigationTarget && cameraRef.current && controlsRef.current) {
           navigateToSection(navigationTarget, cameraRef.current, controlsRef.current);
           memoizedOnClearNavigation();
       }
   }, [navigationTarget, navigateToSection, memoizedOnClearNavigation]);


   // --- Robot Animations (using GSAP) ---
    const animateRobotIdle = () => {
        const { humanoidRobot, head, leftArmGroup, rightArmGroup } = robotRefs.current;
        if(!humanoidRobot || !head || !leftArmGroup || !rightArmGroup) return;
        if (activeTween.current) activeTween.current.kill(); // Kill previous timeline if any
        gsap.killTweensOf([humanoidRobot.position, head.rotation, leftArmGroup.rotation, rightArmGroup.rotation]);
        // Idle animation loops
        gsap.to(humanoidRobot.position, { duration: 3.5, y: 0.03, repeat: -1, yoyo: true, ease: "sine.inOut"});
        gsap.to(head.rotation, { duration: 5, y: THREE.MathUtils.degToRad(8), repeat: -1, yoyo: true, ease: "sine.inOut"});
        gsap.to(leftArmGroup.rotation, { duration: 0.5, x: THREE.MathUtils.degToRad(15), y:0, z: THREE.MathUtils.degToRad(10), ease: "power2.out"});
        gsap.to(rightArmGroup.rotation, { duration: 0.5, x: THREE.MathUtils.degToRad(15), y:0, z: THREE.MathUtils.degToRad(-10), ease: "power2.out"});
    };

    // Placeholder for potential future animation functions
    // These can be implemented later if needed

    // These animations might be removed from the component to avoid unused variable warnings
    // or kept for potential future use


  // Mount point for the Three.js canvas
  return <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />;
};

export default SynthwaveRobotScene;

