import React from 'react';

export const Home = () =>
  <section>
    <div className="home container text-body">
      <h1>Welcome to the clinical annotation platform!</h1>

      <h3>Files Directory</h3>
      <p>
        To get started, navigate to the <b>Files</b> page from the Menu on the left.
        All available files to annotate will be listed on that page.
        These files are sourced from the <span className="code">./data</span> folder in the project.
        Add a new <span className="code">.txt</span> file to that folder to load it into the platform.
      </p>

      <h3>Annotating</h3>
      <p>
        <img src="./images/example.png" className="large" />
        Once you have opened a file, you'll see the text on screen to the left, a section to search for labels on the right, and a bar below highlighted
        in yellow with the text and labels you have selected.
      </p>
      <p>
        To select text, you can manually click and drag over an area of text.
        To select an individual word, you can double click on that word to highlight it more quickly.
      </p>
      <p>
        Once you've highlighted a span of text, to find corresponding labels you can search through labels with the search box on the top right.
        The filters below the search boxes can help you narrow down your label options by
        selecting a desired category of label, like "Finding" or "Procedure".
      </p>
      <p>
        To select a label, just click on it. For more information about a label, click on the info button on the right side of the label.
        Even after labels are selected, they can be removed with the red x.
        Annotations in general can also be deleted with the red trash can.
      </p>
      <p>
        If you don't think there are any CUI matches for a span of text, or the matches are ambiguous, you can select that option with the buttons below the yellow area.
      </p>
      <p>
        If you need to pause annotating, click the pause button in the bottom right of the screen.
      </p>

      <h3>Extracting Annotations</h3>
      <p>
        All changes to the annotations on a file are automatically saved in a
        json file in the same <span className="code">./data</span> folder. The json annotations file
        for a corresponding text file will have the same name as the file with a
        <span className="code">.json</span> extension. The json object for an annotation includes fields
        for the span of text annotated, the UMLS labels selected, the timestamp of
        creation, and whether the annotation was manual or suggested.
      </p>
    </div>
  </section>;
