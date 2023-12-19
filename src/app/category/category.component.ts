import {Component, OnInit} from '@angular/core';
import {CategoryService} from '../service/category.service';
import {CategoryModel} from '../model/category.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categoryForm: FormGroup;
  categories: CategoryModel[] = [];
  successMessage: string = '';
  isEditMode: boolean = false;
  editedCategory: CategoryModel = {id: null, name: null};

  constructor(private fb: FormBuilder, private categoryService: CategoryService) {
    this.categoryForm = this.fb.group({
      id: [null],
      category: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        console.log('Categories loaded successfully:', this.categories);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  createCategory() {
    const categoryValue = this.categoryForm.get('category')?.value;
    const newCategory: CategoryModel = {id: null, name: categoryValue};

    this.categoryService.createCategory(newCategory).subscribe({
      next: (response) => {
        console.log('Category created successfully:', response);
        this.loadCategories();
        this.successMessage = 'The Category Has Been Created Successfully';
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error creating category:', error);
      }
    });
  }


  deleteCategory(category: CategoryModel) {
    return this.categoryService.deleteCategory(category).subscribe({
      next: () => {
        this.loadCategories();
      },
      error: (error) => {
        console.error("Error deleting category:", error);
      }

    });
  }

  editCategory(category: CategoryModel) {
    console.log('Editing category:', category);
    this.isEditMode = true;
    this.editedCategory = {...category};
    this.categoryForm.patchValue({
      id: this.editedCategory.id,
      category: this.editedCategory.name
    });
  }

  onButtonClick() {
    if (this.isEditMode) {
      this.updateCategory()
    } else {
      this.createCategory();
    }
  }

  updateCategory() {
    // Create a new object with the updated values from the form
    const updatedCategory: CategoryModel = {
      id: this.editedCategory.id,
      name: this.categoryForm.get('category')?.value
    };

    // Call the service method to update the category on the backend
    this.categoryService.editCategory(updatedCategory).subscribe({
      next: () => {
        // Reset the form and other necessary properties after successful update
        this.loadCategories();
        this.isEditMode = false;
        this.categoryForm.reset(); // Optional: Reset the form after successful update
      },
      error: (error) => {
        console.error('Error updating category:', error);
      }
    });
  }
}
