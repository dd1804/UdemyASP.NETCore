import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { AlertityService } from '../_services/alertity.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';

  constructor(private userService: UserService, private authService: AuthService,
    private route: ActivatedRoute, private alertifyService: AlertityService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
    });
  }

  loadMessages() {
    const currentUserId = +this.authService.decodedToken.nameid;
    this.userService.getMessages(currentUserId, this.pagination.currentPage,
      this.pagination.itemsPerPage, this.messageContainer)
      .pipe(
        tap(messages => {
          for (let i = 0; i < this.messages.length; i++) {
            if (this.messages[i].isRead === false && this.messages[i].recipientId === currentUserId) {
              this.userService.markAsRead(currentUserId, this.messages[i].id);
            }
          }
        })
      )
      .subscribe((res: PaginatedResult<Message[]>) => {
        this.messages = res.result;
        this.pagination = res.pagination;
      },
      error => {
        this.alertifyService.error(error);
      });
  }

  deleteMessage(id: number) {
    this.alertifyService.confirm('Are you sure you want to delete this message ?', () => {
      this.userService.deleteMessage(id, this.authService.decodedToken.nameid).subscribe(
        () => {
          this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
          this.alertifyService.success('Message has been deleted');
        },
        error => {
          this.alertifyService.error('Failed to delete the message');
        }
      );
    });
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

}
