import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
@ViewChild('videoElement') videoElement!: ElementRef;
  @Input() stream: any;

constructor(private render2: Renderer2, private elementRef: ElementRef){

}

ngOnInit(): void {
 //this.listenerEvents();
}

ngOnDestroy(): void {
  //this.listEvents.forEach(event => event.unsubscribe());
}

loadedMetadata(): void{
  //reemplazo del autoplay que se encuentra en el html
  //this.videoElement.nativeElement.play();
}

listenerPlay(): void{}
}
