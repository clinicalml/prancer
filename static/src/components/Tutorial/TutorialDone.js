import React from 'react';
import { TUTORIAL_SLIDES_LINK } from '../../../constants';

export const TutorialDone = () =>
  <section>
    <div className="container text-body">
      <h1>Thanks for finishing the tutorial!</h1>

      <p>
        You can revisit the <a href={TUTORIAL_SLIDES_LINK} target="_blank">tutorial slides</a> at
        any time or work through the tutorial sequence by navigating here in the menu.
      </p>

      <p>
        The <a href="https://uts.nlm.nih.gov/metathesaurus.html">UMLS Terminology Browser</a> might
        also be helpful as you annotate.
      </p>

      <p>
        To begin providing annotations on clinical notes, click on 'Files' in the
        menu to select a note.
      </p>

    </div>
  </section>;
