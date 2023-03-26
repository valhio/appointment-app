import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddDialogComponent } from 'src/app/pages/management/components/booking-form-settings/add-dialog/add-dialog.component';

@Component({
  selector: 'app-add-category-modal',
  templateUrl: './add-category-modal.component.html',
  styleUrls: ['./add-category-modal.component.scss']
})
export class AddCategoryModalComponent {

  input: string = '';

  constructor(
    private dialogRef: MatDialogRef<AddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      value: string
    }
  ) {
    this.input = data.value;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
