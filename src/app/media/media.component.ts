import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { HandleMediaService } from '../handle-media.service';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css'],
  animations: [

    trigger('bgFade', [
      state('bgIn', style({opacity: 1})),
      state('bgOut', style({opacity: 0})),
      transition('* => *', [animate(1000)])
    ]),
    trigger('dropDownButton', [
      transition(':enter', [ style({height: '0'}),  animate(100, style({height: '*'}))])
    ]),
    trigger('dropDownErr', [
      transition(':enter', [ style({top: '0px'}), animate(200, style({top: "38px"}))]),
      transition(':leave', [ style({top: '38px'}), animate(200, style({top: "0px"}))])
    ]),
    trigger('buttonTextFade', [
      state('txtIn', style({color: 'rgba(255,255,255,1)'})),
      state('txtOut', style({color: 'rgba(255,255,255,0)'})),
      transition('* => *', [animate(300)])
    ])
  ]
})

export class MediaComponent implements OnInit {
  constructor(private mediaService: HandleMediaService) { }
  mediaUrl = "twitter.com";
  thumbnailUrl = "../assets/neural_net_pepe.jpg"
  newThumbnailUrl = this.thumbnailUrl
  downloadLocation = ""
  dlErr = undefined
  bgState = 'bgIn'
  txtState = 'txtOut'

  ngOnInit() {}

  downloadMedia(url: string) {
    url.replace('http://', 'https://')
    if (!url.includes('https://')) {
      url = 'https://' + url;
    }
    try {
      var urlObj = new URL(url);
    } catch (urlErr: any) {
      this.dlErr = urlErr.message;
      return;
    }
    this.mediaService.download(urlObj)
    .subscribe((data: any) => {
      if ('dlError' in data) {
        this.dlErr = data.dlError;
        return
      } else {
        this.dlErr = undefined;
      }
      this.downloadLocation = "WEBSITE DOMAIN NAME" + 
      data._filename.substring (
        data._filename.lastIndexOf('/') + 1
      );

      this.newThumbnailUrl = data.thumbnail;

      this.toggleBgState();
    });
  }

  toggleBgState() {
    this.bgState = this.bgState === 'bgIn' ? 'bgOut' : 'bgIn';
  }

  toggleTxtState() {
    this.txtState = this.txtState === 'txtIn' ? 'txtOut' : 'txtIn';
  }

  logError(err: any) {
    if (err) {
      console.error(err);
    }
  }

  bgFadeDone() {
    if (this.bgState === "bgOut") {
      this.thumbnailUrl = this.newThumbnailUrl;
      this.toggleBgState();
    }
  }
}
