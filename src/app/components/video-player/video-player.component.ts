import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FaceApiService } from '../../services/FaceApi/face-api.service';
import { VideoPlayerService } from '../../services/FaceApi/video-player.service';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
@ViewChild('videoElement') videoElement?: ElementRef;
  @Input() stream: any;
  modelsReady?: boolean;
  listEvents:Array<any> = [];

constructor(private render2: Renderer2,
  private elementRef: ElementRef,
  private faceApiService:FaceApiService,
  private videoPlayerService:VideoPlayerService
){

}

ngOnInit(): void {
 this.listenerEvents();
}

listenerEvents=() => {
  const observer1$ = this.faceApiService.cbModels.subscribe(res => {
    this.modelsReady = true;
    this.checkFace();
  })
  this.listEvents = [observer1$]
  console.log("listenerEvents");
};

checkFace = () => {
  setInterval(async () => {
    await this.videoPlayerService.getLandMark(this.videoElement);
    console.log("checkFace");
  }, 100);
};

ngOnDestroy(): void {
  this.listEvents.forEach(event => event.unsubscribe());
}

loadedMetadata(): void{
  //reemplazo del autoplay que se encuentra en el html
  //this.videoElement.nativeElement.play();
}

listenerPlay(): void{
  const {globalFace} = this.faceApiService;
    // this.overCanvas = globalFace.createCanvasFromMedia(this.videoElement.nativeElement);
    // this.renderer2.setProperty(this.overCanvas, 'id', 'new-canvas-over');
    // this.renderer2.setStyle(this.overCanvas, 'width', `${this.width}px`);
    // this.renderer2.setStyle(this.overCanvas, 'height', `${this.height}px`);
    // this.renderer2.appendChild(this.elementRef.nativeElement, this.overCanvas);
}
}
