import { Injectable } from '@angular/core';

import {Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { resolve } from 'dns';




@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: UserPhoto[] = [];

  constructor() { }
  
  public async addNewToGallery(){

    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    const savedImageFile = await this.savePicture(capturedPhoto);
  

    this.photos.unshift(savedImageFile);
    // this.photos.unshift({
    //   filepath: "soon...",
    //   webviewPath: <string>capturedPhoto.webPath
    // });
  }

  private async savePicture(photo: Photo){
    const base64Data = await this.readAsBase64(photo);
    const filename = new Date().getTime()+'.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: filename,
      data: base64Data,
      directory: Directory.Data
    });

    return{
      filepath: filename,
      webviewPath: <string>photo.webPath
    }
  }

  private async readAsBase64(photo: Photo){
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();

    return await this.convertBlobTobase64(blob) as string;
  }

  private convertBlobTobase64 = (blob: Blob) => new Promise((resolve, reject)=>{
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () =>{
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);

  });
}

export interface UserPhoto{
  filepath: string;
  webviewPath: string;
}



