# happner-cluster-ui

happner cluster demo ui

see [happner-cluster-demo](https://github.com/happner/happner-cluster-demo)

##happner-cluster application suite
*the whole shebang*

###5 UI areas:

1. System - shared by all the other UI parts, has a sidebar, dashboard and notification controllers and templates.

2. Cluster - the cluster control user interface, for managing the cluster which will run jobs.

3. Assemblyline - how assembly lines, droids and blueprints are managed.

4. Organisation - the security layer, how organisations, users, groups and permissions are managed.

5. Warehouse - the database and reporting area, where data templates as JSON schemas, views and reports are managed.

####1.1 System breakdown:
*System contains all the sidebar and shared stuff*

####2.1 Cluster breakdown:

#####2.1.1 cluster - container for the actual physical cluster, whcih is made up of peers
#####2.1.2 peer - peers belong to a cluster, they can be spun up to increase the cluster capacity

####3.1 Assemblyline breakdown:

#####3.1.1 blueprint - a template for how the default code looks for the factory elements (droids etc.) - also contains a construct method, which is what actually builds and instantiates the factory
#####3.1.2 project - an instantiation of a blueprint, with controls, directives, droids and assemblylines
#####3.1.3 site - a process that is able to receive a project and build and host a factory
#####3.1.4 factory - an instantiation of a project running on a site, versioned
#####3.1.5 assemblyline - a workflow of linked droids that run like an actual factory production line, assembly lines have floors/levels and each floor has 64 sectors - so 8 x 8 grid
#####3.1.6 droid - a composite element made up of a directive (back-end code) and controls (front end config)
#####3.1.7 control - front-end html for configuring a droid
#####3.1.8 directive - back-end code that the droid uses to perform its mandate

####4.1 Organisation breakdown:
#####4.1.1 organisation - a logical entity that all clusters, assembly lines and warehouses are grouped under, organisations live in a tree like strucure - so you can get parents
#####4.1.2 user - a set of credentials and personal details that make up someone or something that uses the system
#####4.1.3 group - a set of permissions that multiple users can belong to.

####4.1 Warehouse breakdown:
#####4.1.1 warehouse - a logical entity that all schemas, objects and reports are grouped under.
#####4.1.2 schema - a configurable JSON schema
  - schema items always have name, created and modified properties
  - the default schemas for the system will be set up from the server-side, all items in the system will be built from schemas and objects, ie: user, group, assemblyline, droid, control.
#####4.1.3 filter - linked to a schema, defines a set of criteria ($gt $lt - mongo style) and options (sort | limit etc.) - also has directives for aggregating data $group
  - a default filter exists for all objects that filters by name, created, modified, createdBy, modifiedBy
  - the default filter has a standard set of default options, so that it immmediately lists a resultset
  - the default options lists the latest 20 items created by "me" sorted by the name ascending.
#####4.1.4 view - linked to a schema
  - view says whether the the schema can be edited, deleted or listed
  - declares what filters can be used for listing if it is allowed
  - multiple views can exist for a single schema
  - able to specify the view is something that is lited in the sidebar
  - permissions are assigned to a view.
#####4.1.5 object - a list or single instance of a JSON schema
  - objects are essentially the resultsets of a view
#####4.1.6 report - a group of views arranged in a report structure, either tabular or with graphs or both.
  - report base page is a grid, views are dragged and dropped on to the report page.
  - when a view is dropped, the views filters appear on the top of the report page.
  - the view is then configured to display its result set in tabular or chart form.
  - reports can be saved as an image
  - the system dashboard will eventually just be a report.
