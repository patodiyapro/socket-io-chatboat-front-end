import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { Observable } from "rxjs";
import * as Rx from "rxjs";
import { environment } from "../environments/environment";

@Injectable()
export class WebsocketService {
  private socket;
  constructor() {}
  connect(): Rx.Subject<MessageEvent> {
    this.socket = io("http://localhost:3000");
    const observable = new Observable(item => {
      this.socket.on("connect", () => {

      });
      this.socket.on("get_room", (data) => {
        item.next(data);
      });
      this.socket.on("message", data => {
        console.log("Received message");
        item.next(data);
      });
      this.socket.on("change_username", data => {
        console.log("change_username");
        item.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    const observer = {
      next: (data: Object) => {
        this.socket.emit("message", data);
      }
    };
    return Rx.Subject.create(observer, observable);
  }
}
