import { of } from 'rxjs';

import { RemoteSelectComponent } from './ngx-remote-select.component';

// The custom-api-dropdown control is rendered through this component, so these tests exercise
// the ControlValueAccessor contract it must honor: propagating selection to the parent control,
// marking the control touched, resolving prepopulated values, and reacting to disable().
describe('RemoteSelectComponent (ControlValueAccessor)', () => {
  let component: RemoteSelectComponent;
  const rendererStub: any = {};
  const translateStub: any = { instant: (key: string) => key };

  beforeEach(() => {
    component = new RemoteSelectComponent(rendererStub, translateStub);
  });

  it('creates an instance', () => {
    expect(component).toBeTruthy();
  });

  it('propagates the selected value to the parent form control', () => {
    const onChange = jasmine.createSpy('onChange');
    component.registerOnChange(onChange);

    component.selected('provider-uuid');

    expect(onChange).toHaveBeenCalledWith('provider-uuid');
  });

  it('marks the control as touched on selection', () => {
    const onTouched = jasmine.createSpy('onTouched');
    component.registerOnTouched(onTouched);

    component.selected('provider-uuid');

    expect(onTouched).toHaveBeenCalled();
  });

  it('resolves and displays a prepopulated value on writeValue', () => {
    const saved = { value: 'saved-uuid', label: 'Saved Provider' };
    const dataSource: any = {
      resolveSelectedValue: jasmine
        .createSpy('resolveSelectedValue')
        .and.returnValue(of(saved))
    };
    component.dataSource = dataSource;

    component.writeValue('saved-uuid');

    expect(dataSource.resolveSelectedValue).toHaveBeenCalledWith('saved-uuid');
    expect(component.items).toEqual([saved] as any);
    expect(component.selectedRemoteOptions).toEqual(saved as any);
  });

  it('does not resolve when writeValue receives an empty value', () => {
    const dataSource: any = {
      resolveSelectedValue: jasmine.createSpy('resolveSelectedValue')
    };
    component.dataSource = dataSource;

    component.writeValue('');

    expect(dataSource.resolveSelectedValue).not.toHaveBeenCalled();
  });

  it('disables the inner control via setDisabledState', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBe(true);

    component.setDisabledState(false);
    expect(component.disabled).toBe(false);
  });
});
