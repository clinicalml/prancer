##  Overview
Our platform enables the rapid annotation of medical terms within clinical notes. A user can highlight spans of text and quickly map them to concepts in large vocabularies within a single, intuitive platform. Users can use the search and recommendation features to find labels without ever needing to leave the interface. Further, the platform can take in output from existing clinical concept extraction systems as pre-annotations, which users can accept or modify in a single click. These features allow users to focus their time and energy on harder examples instead. See the demo below!

<video controls="controls" width="500" height="300" name="Demo" src="files/annotator_demo.mov"></video>

## Why?
Clinical notes document detailed patient information, including pertinent medical history, procedures performed during a visit, and response to treatment. This information can be leveraged for a variety of use cases--from more personalized decision support in electronic health record to richer retrospective research. 

However, this data often exists only in clinical text, and not in any structured fields; therefore, many use cases involve manual or automated structuring of relevant concepts from clinical notes. Current automated approaches of extracting structured clinical concepts are insufficiently robust for many downstream uses, and there isn't much annotated training data publicly available to improve machine learning models. The goal of our platform is to make that annotation process easier and faster: whether for a manual curation use case, or for the creation of an annotated training dataset.

       
##  Features
### Pre-Annotations
Sometimes concept mentions are simple and straightforward for algorithms to recognize. In these cases, we allow for <i>pre-annotations<i>; these pre-outline the suggested span of text and pre-label it. The user can then to choose to accept in just a single click, or modify or delete.
<figure>
       <img src="files/suggestion.png" width="500">
       <figcaption>In this image, there are 3 pre-annotations: on flagyl, BUN, and NGT.</figcaption>
</figure>
Our system is flexible and allows the user to set the outputs of any clinical entity extraction system (MetaMap, cTAKES, ClinicalBERT) as pre-annotations. A user just provides the spans and expected labels in a CSV file; we provide scripts to generate these CSV's from dictionary lookups and from scispaCy. 
       
### Recommendations
<img src="files/rec.png" width="500">

### Search
<img src="files/search.png" width="500">

### UMLS Linking
<img src="files/more_info.png" width="500">

### Concept Categories
<img src="files/filter.png" width="500">

### Flexible Annotation
<img src="files/match_options.png" width="500">

## How to Use
### Installation Instructions
### Loading in Data
### Creating Custom Vocabulary
