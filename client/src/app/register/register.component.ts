import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxGalleryThumbnailsComponent } from '@kolkov/ngx-gallery';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
@Input() usersFromHomeComponent:any;
@Output() cancelRegister=new EventEmitter();
  maxDate:Date;
  registerForm:FormGroup;
  validationErrors: string[]=[];
  constructor(private accountService:AccountService,private toast:ToastrService,private fb:FormBuilder,
    private router:Router) { }

  ngOnInit(): void {
  this.intitailizeForm();
  this.maxDate=new Date();
  this.maxDate.setFullYear(this.maxDate.getFullYear()-18);
  
  }
  
  intitailizeForm() 
  {
    this.registerForm=this.fb.group({
     gender:['male'],
     username:['',Validators.required],
     KnownAs:['',Validators.required],
     dateOfBirth:['',Validators.required],
     city:['',Validators.required],
     country:['',Validators.required],

     password: ['',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
     confirmpassword: ['',[Validators.required,this.matchValues('password')]]
    })
    // this.registerForm.controls.password.valueChanges.subscribe(()=>{
    // this.registerForm.controls.confirmpassword.updateValueAndValidity();
    // })
  }
   
  matchValues(matchTo:string)
  {
    return (control:AbstractControl)=>{
    return control?.value===control?.parent?.controls[matchTo].value?null:{isMatching:true}
    }
  }

  register()
    {
      this.accountService.register(this.registerForm.value).subscribe(
        response=>{
          this.router.navigateByUrl('/members')
        },
        error=>{
        this.validationErrors=error;
          // console.log(error);
          // this.toast.error(error.error);
        }
      )
      console.log(this.registerForm);
    }
    cancel()
    {
      this.cancelRegister.emit(false);
    }
  
}
