import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MediaData } from 'src/models/media-data';
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
      transition(':enter', [ style({top: '0px'}), animate(200, style({top: "35px"}))]),
      transition(':leave', [ style({top: '35px'}), animate(200, style({top: "0px"}))])
    ]),
    trigger('buttonTextFade', [
      state('txtIn', style({color: 'rgba(255,255,255,1)'})),
      state('txtOut', style({color: 'rgba(255,255,255,0)'})),
      transition('* => *', [animate(300)])
    ])
  ]
})

export class MediaComponent implements OnInit {
  mediaForm: FormGroup
  constructor(private mediaService: HandleMediaService,
    private formBuilder: FormBuilder) {
      this.mediaForm = this.createFormGroup(this.formBuilder);
    }
  thumbnailUrl = ""
  newThumbnailUrl = this.thumbnailUrl
  downloadLocation = ""
  dlErr = ""
  bgState = 'bgIn'
  txtState = 'txtOut'

  ngOnInit(): void {
    // Empty
  }

  /**
   * This method creates a FormGroup for the Twitter URL input.
   * @param formBuilder 
   * @returns 
   */
  createFormGroup(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      mediaData: formBuilder.group(new MediaData())
    });
  }

  /**
   * This method is used to call the {@link HandleMediaService | handle media service}.
   */
  downloadMedia(): void {
    const mediaData: MediaData = Object.assign(
      {}, this.mediaForm.value.mediaData
    );
    let url: string = mediaData.mediaUrl;
    
    url.replace('http://', 'https://')
    if (!url.includes('https://')) {
      url = 'https://' + url;
    }

    const urlObj = new URL(url);

    this.mediaService.download(urlObj)
    .subscribe((data: any) => {
      this.downloadLocation = "https://twt-dl.app/" + 
      data._filename.substring (
        data._filename.lastIndexOf('/') + 1
      )
      this.newThumbnailUrl = data.thumbnail;
      },
      err => {
        this.dlErr = err;
      },
      () => {
        this.toggleBgState();
        this.dlErr = "";
      })
    }

  /**
   * Toggles the state of the bgFade animation.
   */
  toggleBgState(): void {
    this.bgState = this.bgState === 'bgIn' ? 'bgOut' : 'bgIn';
  }

  /**
   * Toggles the state of the buttonTextFade animation.
   */
  toggleTxtState(): void {
    this.txtState = this.txtState === 'txtIn' ? 'txtOut' : 'txtIn';
  }

  /**
   * Simply used to log errors.
   * @param err 
   */
  logError(err: any): void {
    if (err) {
      console.error(err);
    }
  }

  /**
   * This method is called once the bgFade animation finishes
   */
  bgFadeDone(): void {
    if (this.bgState === "bgOut") {
      this.thumbnailUrl = this.newThumbnailUrl;
      this.toggleBgState();
    }
  }
}
