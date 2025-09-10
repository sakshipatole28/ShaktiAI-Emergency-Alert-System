import { alertService } from './AlertService';

export interface DetectionResult {
  confidence: number;
  type: 'gesture' | 'voice';
  timestamp: number;
  detected: boolean;
}

class AIDetectionService {
  private isGestureDetectionActive = false;
  private isVoiceDetectionActive = false;
  private gestureDetectionCallback?: (result: DetectionResult) => void;
  private voiceDetectionCallback?: (result: DetectionResult) => void;
  private audioRecording?: Audio.Recording;

  // Mock AI models for demo purposes
  private gestureThreshold = 0.7;
  private voiceThreshold = 0.8;

  // Start gesture detection (demo mode - no camera permissions needed)
  async startGestureDetection(callback?: (result: DetectionResult) => void): Promise<boolean> {
    try {
      this.isGestureDetectionActive = true;
      this.gestureDetectionCallback = callback;

      // Simulate gesture detection with periodic checks (demo mode)
      this.simulateGestureDetection();
      
      console.log('Gesture detection started (demo mode)');
      return true;
    } catch (error) {
      console.error('Error starting gesture detection:', error);
      return false;
    }
  }

  // Stop gesture detection
  stopGestureDetection() {
    this.isGestureDetectionActive = false;
    this.gestureDetectionCallback = undefined;
    console.log('Gesture detection stopped');
  }

  // Start voice detection (demo mode - no audio permissions needed)
  async startVoiceDetection(callback?: (result: DetectionResult) => void): Promise<boolean> {
    try {
      this.isVoiceDetectionActive = true;
      this.voiceDetectionCallback = callback;

      // Simulate voice detection (demo mode)
      this.simulateVoiceDetection();
      
      console.log('Voice detection started (demo mode)');
      return true;
    } catch (error) {
      console.error('Error starting voice detection:', error);
      return false;
    }
  }

  // Stop voice detection (demo mode)
  async stopVoiceDetection() {
    this.isVoiceDetectionActive = false;
    this.voiceDetectionCallback = undefined;
    console.log('Voice detection stopped (demo mode)');
  }

  // Simulate gesture detection (in real app, would use TensorFlow Lite model)
  private simulateGestureDetection() {
    const checkGesture = () => {
      if (!this.isGestureDetectionActive) return;

      // Simulate random gesture detection for demo
      // In real app, this would analyze camera feed using TensorFlow Lite
      const randomConfidence = Math.random();
      const isGestureDetected = randomConfidence > this.gestureThreshold;

      const result: DetectionResult = {
        confidence: randomConfidence,
        type: 'gesture',
        timestamp: Date.now(),
        detected: isGestureDetected,
      };

      if (isGestureDetected && this.gestureDetectionCallback) {
        this.gestureDetectionCallback(result);
        this.triggerGestureAlert();
      }

      // Continue checking every 2 seconds
      setTimeout(checkGesture, 2000);
    };

    checkGesture();
  }


  // Simulate voice detection (in real app, would analyze audio for screams/distress)
  private simulateVoiceDetection() {
    const checkVoice = () => {
      if (!this.isVoiceDetectionActive) return;

      // Simulate random voice detection for demo
      // In real app, this would analyze audio buffer for scream patterns
      const randomConfidence = Math.random();
      const isVoiceDetected = randomConfidence > this.voiceThreshold;

      const result: DetectionResult = {
        confidence: randomConfidence,
        type: 'voice',
        timestamp: Date.now(),
        detected: isVoiceDetected,
      };

      if (isVoiceDetected && this.voiceDetectionCallback) {
        this.voiceDetectionCallback(result);
        this.triggerVoiceAlert();
      }

      // Continue checking every 3 seconds
      setTimeout(checkVoice, 3000);
    };

    checkVoice();
  }

  // Trigger gesture-based alert
  private async triggerGestureAlert() {
    try {
      await alertService.broadcastAlert('gesture');
      console.log('Gesture alert triggered');
    } catch (error) {
      console.error('Error triggering gesture alert:', error);
    }
  }

  // Trigger voice-based alert
  private async triggerVoiceAlert() {
    try {
      await alertService.broadcastAlert('voice');
      console.log('Voice alert triggered');
    } catch (error) {
      console.error('Error triggering voice alert:', error);
    }
  }

  // Manual trigger for demo purposes
  async triggerDemoGestureAlert(): Promise<void> {
    const result: DetectionResult = {
      confidence: 0.95,
      type: 'gesture',
      timestamp: Date.now(),
      detected: true,
    };

    if (this.gestureDetectionCallback) {
      this.gestureDetectionCallback(result);
    }

    await this.triggerGestureAlert();
  }

  // Manual trigger for demo purposes
  async triggerDemoVoiceAlert(): Promise<void> {
    const result: DetectionResult = {
      confidence: 0.92,
      type: 'voice',
      timestamp: Date.now(),
      detected: true,
    };

    if (this.voiceDetectionCallback) {
      this.voiceDetectionCallback(result);
    }

    await this.triggerVoiceAlert();
  }

  // Get detection status
  getStatus() {
    return {
      gestureActive: this.isGestureDetectionActive,
      voiceActive: this.isVoiceDetectionActive,
    };
  }

  // Stop all detection
  async stopAllDetection() {
    this.stopGestureDetection();
    await this.stopVoiceDetection();
  }

  // Load mock TensorFlow Lite models (for demo)
  async loadModels(): Promise<boolean> {
    try {
      // In a real app, this would load actual .tflite files
      console.log('Loading gesture recognition model...');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading time
      
      console.log('Loading voice detection model...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('AI models loaded successfully');
      return true;
    } catch (error) {
      console.error('Error loading AI models:', error);
      return false;
    }
  }

  // Set detection thresholds
  setGestureThreshold(threshold: number) {
    this.gestureThreshold = Math.max(0, Math.min(1, threshold));
  }

  setVoiceThreshold(threshold: number) {
    this.voiceThreshold = Math.max(0, Math.min(1, threshold));
  }
}

// Export singleton instance
export const aiDetectionService = new AIDetectionService();
