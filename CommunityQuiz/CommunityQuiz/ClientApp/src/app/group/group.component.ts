import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormModalModel } from '../models/FormModalModel';
import { IGroup, Group } from '../models/Nodes/IGroup';
import { IUser } from '../models/Nodes/IUser';
import { IUserGroup } from '../models/Nodes/IUserGroup';
import { BackendConnectService } from '../services/backend-connect.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit {
  addEditCommunication = new FormModalModel<IGroup, IGroup>();
  removeGroupConfirmCommunication = new FormModalModel<string, void>();

  removeConfirmCommunication = new FormModalModel<string, void>();
  addConfirmCommunication = new FormModalModel<string, void>();
  subs: Subscription[] = [];

  groupCollection: IGroup[] = [];
  members: IUser[] = [];
  nonmembers: IUser[] = [];

  selectedGroup: IGroup | undefined;
  stagedRemoveUser: IUser | undefined;
  stagedAddUser: IUser | undefined;

  constructor(private backend: BackendConnectService) {}

  ngOnInit(): void {
    this.subs.push(
      this.addEditCommunication.OnClose().subscribe({
        next: (val) => {
          if (val.Id === 0)
            this.backend.Group.Post(val).subscribe({
              complete: () => {
                this.LoadGroupsFromBackend();
                this.LoadInitialNonMembers();
              },
            });
          else
            this.backend.Group.Put(val).subscribe({
              complete: () => {
                this.LoadGroupsFromBackend();
                this.LoadInitialNonMembers();
              },
            });
        },
      })
    );

    this.subs.push(
      this.removeGroupConfirmCommunication.OnClose().subscribe({
        next: () => {
          this.backend.Group.Delete(this.selectedGroup!.Id).subscribe({
            complete: () => {
              this.LoadGroupsFromBackend();
              this.LoadInitialNonMembers();
            },
          });
        },
      })
    );

    this.subs.push(
      this.removeConfirmCommunication.OnClose().subscribe({
        next: () => this.RemoveUserFromGroupConfirmed(),
      })
    );
    this.subs.push(
      this.addConfirmCommunication.OnClose().subscribe({
        next: () => this.AddUserToGroupConfirmed(),
      })
    );

    this.LoadGroupsFromBackend();
    this.LoadInitialNonMembers();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  LoadGroupsFromBackend() {
    this.selectedGroup = undefined;
    this.backend.Group.GetAll().subscribe({
      next: (val) => (this.groupCollection = val),
    });
  }

  LoadInitialNonMembers() {
    this.members = [];
    this.backend.User.GetAllUsers().subscribe({
      next: (val) => (this.nonmembers = val),
    });
  }

  LoadMembersAndNonMembers(id: number) {
    this.backend.User.GetUserGroupMember(id).subscribe({
      next: (items) => (this.members = items),
    });

    this.backend.User.GetUserGroupNonMember(id).subscribe({
      next: (items) => (this.nonmembers = items),
    });
  }

  SelectGroup(input: IGroup) {
    this.selectedGroup = input;
    this.LoadMembersAndNonMembers(this.selectedGroup.Id);
  }

  AddUserToGroup(input: IUser) {
    this.stagedAddUser = input;

    this.addConfirmCommunication.OpenInit(
      'Are you sure you want to add user: "' +
        this.stagedAddUser!.UserName +
        '" to group: "' +
        this.selectedGroup!.GroupName +
        '"?'
    );
  }

  private AddUserToGroupConfirmed() {
    const link: IUserGroup = {
      UserId: this.stagedAddUser!.Id,
      GroupId: this.selectedGroup!.Id,
    };

    this.backend.UserGroup.PostUserGroup(link).subscribe({
      next: () => {
        this.LoadMembersAndNonMembers(this.selectedGroup!.Id);
      },
    });
  }

  RemoveUserFromGroup(input: IUser) {
    this.stagedRemoveUser = input;

    this.removeConfirmCommunication.OpenInit(
      'Are you sure you want to remove user: "' +
        this.stagedRemoveUser!.UserName +
        '" from group: "' +
        this.selectedGroup!.GroupName +
        '"?'
    );
  }

  private RemoveUserFromGroupConfirmed() {
    const link: IUserGroup = {
      UserId: this.stagedRemoveUser!.Id,
      GroupId: this.selectedGroup!.Id,
    };

    this.backend.UserGroup.DeleteUserGroup(link).subscribe({
      next: () => {
        this.LoadMembersAndNonMembers(this.selectedGroup!.Id);
      },
    });
  }

  AddNewGroup() {
    this.addEditCommunication.OpenInit(new Group());
  }

  EditGroup(event: MouseEvent, val: IGroup) {
    event.stopPropagation();
    this.addEditCommunication.OpenInit(val);
  }

  RemoveGroup(event: MouseEvent, val: IGroup) {
    event.stopPropagation();
    this.selectedGroup = val;
    this.removeGroupConfirmCommunication.OpenInit(
      'Are you sure you want to remove the group and all associated Quizzes?'
    );
  }
}
