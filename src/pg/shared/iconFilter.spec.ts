import { iconFilter, sanitizeTerm } from './iconFilter'
import { Icon } from './models/icon';

const iconBar = { id: '1', name: 'bar', aliases: [] };
const iconFooBar = { id: '2', name: 'foo-bar', aliases: [] };
const iconBarHmm = { id: '3', name: 'bar-hmm', aliases: [] };
const iconFoo = { id: '4', name: 'foo', aliases: [] };
const iconMeh = { id: '5', name: 'meh', aliases: [{ name: 'foo' }] };
const iconHello = { id: '6', name: 'hello', aliases: [{ name: 'world' }] };
const icons = [
  iconBar,
  iconFooBar,
  iconBarHmm,
  iconFoo,
  iconMeh,
  iconHello
] as Icon[];

describe('pg-icon', () => {

  it('should shift "foo" to index 0', () => {
    const filteredIcons = iconFilter(icons, 'foo');
    expect(filteredIcons.length).toEqual(3);
    expect(filteredIcons[0]).toEqual(iconFoo);
  });

  it('should match on alias', () => {
    const filteredIcons = iconFilter(icons, 'world');
    expect(filteredIcons.length).toEqual(1);
    expect(filteredIcons[0]).toEqual(iconHello);
  });

  it('should reorder starts with "bar"', () => {
    const filteredIcons = iconFilter(icons, 'bar');
    expect(filteredIcons.length).toEqual(3);
    expect(filteredIcons[0]).toEqual(iconBar);
    expect(filteredIcons[1]).toEqual(iconBarHmm);
    expect(filteredIcons[2]).toEqual(iconFooBar);
  });

  it('should match none', () => {
    const filteredIcons = iconFilter(icons, 'nothing');
    expect(filteredIcons.length).toEqual(0);
  });

  it('should match with capital "Foo"', () => {
    const filteredIcons = iconFilter(icons, 'Foo');
    expect(filteredIcons.length).toEqual(3);
  });

  it('should convert diacritics "fóo"', () => {
    const filteredIcons = iconFilter(icons, 'Fóo');
    expect(filteredIcons.length).toEqual(3);
  });

  it('should sanitizeTerm', () => {
    const term = sanitizeTerm('foo bar');
    expect(term).toEqual('foo-bar');
  });

});
