// lib/webrtc.ts

import { webRTCOffer } from '@/api/stream.ts';

export class WebRTCConnection {
    private pc: RTCPeerConnection;
  
    constructor() {
      // Initialize the RTCPeerConnection with a STUN server configuration
      this.pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });
    }
  
    /**
     * Start the WebRTC connection and play the video in the provided video element
     * @param videoElement - HTML video element to display the WebRTC stream
     */
    public async start(videoElement: HTMLVideoElement, audioElement: HTMLAudioElement): Promise<void> {
      const offerOptions: RTCOfferOptions = {
        iceRestart: true,
        offerToReceiveAudio: true,  // Enable audio
        offerToReceiveVideo: true,  // Enable video
      };
      // Handle the ontrack event to set the incoming video stream
      this.pc.ontrack = (event: RTCTrackEvent) => {
        
        // Check the kind of the track
        if (event.track.kind === 'video' && event.streams[0]) {
            console.log("onTrack event: set video object");
            videoElement.srcObject = event.streams[0];
        } else if (event.track.kind === 'audio' && event.streams[0]) {
            console.log("onTrack event: set audio object");
            audioElement.srcObject = event.streams[0];
            audioElement.play(); // Play the audio element if needed
        }
      };
  
      // Add a video transceiver to receive the video stream
      this.pc.addTransceiver('video', { direction: 'recvonly' });
      this.pc.addTransceiver('audio', { direction: 'recvonly' });
  
      try {
        // Create an SDP offer and set it as the local description
        const offer = await this.pc.createOffer(offerOptions);
        await this.pc.setLocalDescription(offer);
  
        // Send the local SDP offer to the API and await the remote SDP answer
        const response = await webRTCOffer(this.pc.localDescription)
  
        // Retrieve the remote SDP answer and set it as the remote description
        if (response.code === 0 && response.data) {
          const sessionDescription = new RTCSessionDescription(response.data);
          await this.pc.setRemoteDescription(sessionDescription);
        } else {
          console.error('Failed to retrieve remote session description');
        }
      } catch (error) {
        console.error('Error setting up WebRTC connection:', error);
      }
    }
  
    /**
     * Close the WebRTC connection and release resources
     */
    public close(): void {
      console.log("Closing WebRTC");
      this.pc.close();
    }
  }
  