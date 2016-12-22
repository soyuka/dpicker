import { forwardRef, ElementRef, Directive, Input, OnInit } from '@angular/core'
import { NG_VALUE_ACCESSOR, ControlValueAccessor, Validator, NG_VALIDATORS, AbstractControl } from '@angular/forms';

const defaultFormat = 'DD/MM/YYYY'
const DPicker = (require('dpicker') as any)
const moment = (require('moment') as any)

@Directive({
  selector: '[ngDpicker]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgDpicker),
    multi: true
  }, 
  {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => NgDpicker),
    multi: true
  }
  ],
})
export class NgDpicker implements ControlValueAccessor, OnInit {
  constructor(public elementRef: ElementRef) {
    try {
      this.dpicker = new DPicker(this.elementRef.nativeElement)
    } catch(e) {
      console.error(e.message)
    }
  }

  private onChangeCallback: (_: any) => void = () => {}
  private onTouchedCallback: () => void = () => {}
  dpicker: any
  @Input() max: string;
  @Input() min: string;

  getMoment(input: string|Date): any {
    if (!input) {
      return null
    }

    if (!(input instanceof Date) || !(moment.isMoment(input))) {
      return moment(input, dateFormat)
    } else {
      return moment(input)
    }
  }

  ngOnInit() {
    this.dpicker.onChange = () => {
      this.onChangeCallback(this.dpicker.model)
      this.onTouchedCallback()
    }

    //initialization
    setImmediate(() => {
      this.onChangeCallback(this.dpicker.model)
      this.onTouchedCallback()
    })
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn
  }

  registerOnTouched(fn:any) {
    this.onTouchedCallback = fn;
  }

  writeValue(value: any) {
    this.dpicker.model = this.getMoment(value)
  }

  validate(c: AbstractControl): { [key: string]: any } {
    if (moment.isMoment(c.value)) {
      this.dpicker.isValid(c.value)
    }

    if (this.dpicker.valid === true) {
      return null
    }

    return {validDate: false}
  }
}
