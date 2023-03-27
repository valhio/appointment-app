import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-category-modal',
  templateUrl: './add-category-modal.component.html',
  styleUrls: ['./add-category-modal.component.scss']
})
export class AddCategoryModalComponent {

  input: string = '';

  constructor(
    private dialogRef: MatDialogRef<AddCategoryModalComponent>,
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
