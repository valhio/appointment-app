import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddDialogComponent } from 'src/app/pages/management/components/booking-form-settings/add-dialog/add-dialog.component';

@Component({
  selector: 'app-update-field-modal',
  templateUrl: './update-field-modal.component.html',
  styleUrls: ['./update-field-modal.component.scss']
})
export class UpdateFieldModalComponent {

  input: string[] = [];
  toUpdate: string;

  constructor(
    private dialogRef: MatDialogRef<AddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      value: string[],
      toUpdate: string
    }
  ) {
    this.input = [...data.value]; // [...data.value] otherwise it will be a reference to the original array and the original array will be changed too
    this.toUpdate = data.toUpdate;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  trackByFn(index: number, item: any) {
    return index;  
  }

  addField() {
    this.input.push('');
  }

  removeField(index: number) {
    this.input.splice(index, 1);
  }

}
