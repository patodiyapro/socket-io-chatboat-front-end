import { Component, OnInit } from "@angular/core";
import { ChatService } from "./chat.service";
import { ToastrService } from "ngx-toastr";

declare var $: any;
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.sass"]
})
export class AppComponent implements OnInit {
  public _typing = false;
  public _timeout = undefined;
  public _users = [];
  public message: string;
  public chatRoome = [];
  public chatUser = [];
  public userConnected = [];
  public chatType: {
    nickname: string;
    isTyping: boolean;
  };
  public newName: string;
  public currentUser: string;
  public chatTypeing = [];
  public addNewUser: string;
  constructor(private chat: ChatService, private toastr: ToastrService) {}

  ngOnInit() {
    $("#action_menu_btn").click(function() {
      $(".action_menu").toggle();
    });
    $("#sendmsg").keypress(e => {
      if (e.which !== 13) {
        if (this._typing === false && $("#msg").is(":focus")) {
          this._typing = true;
          this.chat.socket.emit("user typing", true);
          this._timeout = setTimeout(() => {
            this._typing = false;
            this.chat.socket.emit("user typing", false);
          }, 3000);
        } else {
          clearTimeout(this._timeout);
          this._timeout = setTimeout(() => {
            this._typing = false;
            this.chat.socket.emit("user typing", false);
          }, 3000);
        }
      }
    });
    this.chat.socket.on("notify user", user => {
      this.userConnected.push(user);
      this.currentUser = user;
      this.toastr.success("You have joined as " + user);
    });
    this.chat.socket.on("user namechange", name => {
      this.userConnected.splice(this.userConnected.indexOf(this.currentUser), 1);
      this.chatUser.filter(item => {
        if (item.nickname === this.currentUser) {
          item.nickname = name.nickname;
        }
      });
      this.currentUser = name.nickname;
    });
    this.chat.socket.on("user disconnected", user => {
      this.userConnected.splice(this.userConnected.indexOf(user), 1);
      this.toastr.info(user + " has left.");
    });
    this.chat.socket.on("chat message", msg => {
      this.chatUser.push(msg);
      if (this.userConnected.indexOf(msg.nickname) === -1) {
        this.userConnected.push(msg.nickname);
        this.toastr.info(msg.nickname + " has joined.");
      }
      return msg;
    });
    this.chat.socket.on("user connected", user => {
      this.userConnected.push(user);
      this.toastr.info(user + " has joined.");
    });
    this.chat.socket.on("user typing", msg => {
      this.chatType = msg;
      const i = this.chatTypeing.indexOf(msg.nickname);
      if (msg.isTyping) {
        if (i === -1) {
          this.chatTypeing.push(msg.nickname);
        }
      } else {
        if (i !== -1) {
          this.chatTypeing.splice(i, 1);
        }
      }
      switch (this.chatTypeing.length) {
        case 0:
          $("#typing-event").html("");
          break;
        case 1:
          $("#typing-event").html(`${this.chatTypeing[0]} is typing...`);
          break;
        case 2:
          $("#typing-event").html(
            `${this.chatTypeing[0]} and ${this.chatTypeing[1]} are typing...`
          );
          break;
        default:
          $("#typing-event").html("Multiple users are typing...");
          break;
      }
    });
    this.chat.socket.on("disconnect", () => {
      this.userConnected = [];
      this.chatUser = [];
    });
  }
  updateuserName() {
    if (this.newName) {
      this.chat.updateuserName(this.newName);
      this.newName = null;
      $('#exampleModal').modal('hide');
    }
  }

  addUser() {
    if (this.addNewUser) {
      this.chat.addYourFriend(this.addNewUser);
      this.addNewUser = null;
      $('#exampleModal').modal('hide');
    }
  }
  sendMessage() {
    if (this.message) {
      this.chat.sendMsg(this.message);
      this.message = null;
      return false;
    } else {
      return true;
    }
  }
}
