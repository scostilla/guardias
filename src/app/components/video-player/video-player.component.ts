import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FaceApiService } from '../../services/FaceApi/face-api.service';
import { VideoPlayerService } from '../../services/FaceApi/video-player.service';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
@ViewChild('videoElement') videoElement!: ElementRef;
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
  }, 100);
};

ngOnDestroy(): void {
  this.listEvents.forEach(event => event.unsubscribe());
}

loadedMetadata(): void{
  //reemplazo del autoplay que se encuentra en el html
  //this.videoElement.nativeElement.play();
}

listenerPlay(): void{}
}
