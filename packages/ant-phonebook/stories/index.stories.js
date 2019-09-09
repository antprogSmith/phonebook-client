import { storiesOf, html, withKnobs, withClassPropertiesKnobs } from '@open-wc/demoing-storybook';

import { AntPhonebook } from '../src/AntPhonebook.js';
import '../ant-phonebook.js';

storiesOf('ant-phonebook', module)
  .addDecorator(withKnobs)
  .add('Documentation', () => withClassPropertiesKnobs(AntPhonebook))
  .add(
    'Alternative Title',
    () => html`
      <ant-phonebook .title=${'Something else'}></ant-phonebook>
    `,
  );
