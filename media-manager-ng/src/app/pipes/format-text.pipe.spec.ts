import { FormatTextPipe } from './format-text.pipe';

xdescribe('FormatTextPipe', () => {
  it('create an instance', () => {
    const pipe = new FormatTextPipe();
    expect(pipe).toBeTruthy();
  });
});
