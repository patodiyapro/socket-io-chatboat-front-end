import * as io from "socket.io-client";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import * as Rx from "rxjs";
import { WebsocketService } from "./websocket.service";
@Injectable({
  providedIn: "root"
})
@Injectable()
export class ChatService {
  public socket;
  constructor() {
    this.socket = io("http://localhost:3000");
  }

  sendMsg(message) {
    this.socket.emit("chat message", { message });
  }
  updateuserName(name) {
    this.socket.emit("user namechange", name);
  }

  addYourFriend(newUser) {
    this.socket.emit("add user", newUser);
  }
  setUserName(userName) {
    this.socket.emit("change_username", { username: userName });
  }
  getRoom() {}
}
