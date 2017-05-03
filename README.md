# happner-cluster-ui

happner cluster demo ui

see [happner-cluster-demo](https://github.com/happner/happner-cluster-demo)

##happner-cluster application suite
*the whole shebang*

###how to run it:
```bash
npm install
bower install
node server/start
```

###5 UI areas:

*The base layer is the system, it is shared by all layers, the first layer after the system, is the organisation layer - it holds the organisations, users and groups that define permission sets for all the operations made in the system. The warehouse is how all objects are persisted, listed and in combination with the organisation layer, how operations changing the objects are permissioned in the system. The cluster is the area controlling the actual system processes, and also provides the sites where assembly lines can be deployed to. The assembly line is where flow driven processes and their steps can be designed, the system will have a bunch of flows it will use internally for all of its operations.*

1. System - shared by all the other UI parts, has a sidebar, dashboard and notification controllers and templates.

2. Organisation - the security layer, how organisations, users, groups and permissions are managed.

3. Warehouse - the database and reporting area, where data templates as JSON schemas, views and reports are managed.

4. Cluster - the cluster control user interface, for managing the cluster which will run jobs.

5. Assemblyline - basically a service bus, how assembly lines, droids and blueprints are managed.

####1.1 System breakdown:
*System contains all the sidebar and shared stuff*

####2.1 Organisation breakdown:
*organisations are tree-like - this means that a user that has ADMIN privileges in an organisation that is a parent of other organisations, will have ADMIN privileges on the child organisations.*
#####2.1.1 organisation - a logical entity that all clusters, assembly lines and warehouses are grouped under, organisations live in a tree like strucure - so you can get parents
#####2.1.2 user - a set of credentials and personal details that make up someone or something that uses the system
#####2.1.3 group - a set of permissions that multiple users can belong to.

####3.1 Warehouse breakdown:
*the warehouse is how data is arranged, viewed and permissioned in the system. all data is modified by operations which are pushed through the system via happn using paths that encompass the organisation id, the id if the view associated with the data and the operation which is either "list","delete","edit" or "view"*
#####3.1.1 schema - a configurable JSON schema
  - schema items always have name, created and modified properties
  - the default schemas for the system will be set up from the server-side, all items in the system will be built from schemas and objects, ie: user, group, assemblyline, droid, control.
#####3.1.2 filter - linked to a schema, defines a set of criteria ($gt $lt - mongo style) and options (sort | limit etc.) - also has directives for aggregating data $group - grouped under schema.
  - a default filter exists for all objects that filters by name, created, modified, createdBy, modifiedBy
  - the default filter has a standard set of default options, so that it immmediately lists a resultset
  - the default options lists the latest 20 items created by "me" sorted by the name ascending.
#####3.1.3 view - linked to a schema - grouped under schema.
  - view says whether the the schema can be edited, deleted or listed
  - declares what filters can be used for listing if it is allowed
  - multiple views can exist for a single schema
  - able to specify the view is something that is listed in the sidebar, and what area in the sidebar it is listed under. This is done by updating the "sidebar" fields under the view mode (edit,view,delete,list) section to have the id of the sidebar area you want the link to exist under, and the name of the sidebar link.
  - permissions are assigned to a view.
  - view has 4 modes: (1) edit - for editing an object, (2) view for viewing an objects properties, (3) delete, usually a confirmation on whether to continue with the delete, 4. list - listing of objects
  - each mode has configurable options peculiar to it, list and view have "fields" a list of the fields the view will show, "edit" and "view" have a list of "defaults" or default values to display when the property value for that field is null.
  - views have edit, delete, view and list enabled by default
  - the edit view makes all the fields apart from the system ones (created, deleted, createdBy, modifiedBy, deletedBy) editable by default
  - the list view makes only the name, created, modified, createdBy, modifiedBy, deleted, deletedBy visible by default
  - the list view uses the default filter set automatically generated, which is to be able to filter by name, created, modified, limited to 20 items
  - a composite view can be created by selecting multiple schemas and joining them by a list of fields they have i common
  - the composite view can be a deduplicated AGGREGATION VIEW: have composite fields that are SUMMED/MULTIPLIED/APPENDED/MIN/MAX/FUNC (user defined aggregator function)
  - or the composite view can be duplicated MATRIX VIEW: rows are duplicated to include values that are products of many-to-any relationships
  - when saving an editable composite view, only the un-calculated fields are editable and saveable
  - GROUPS are assigned permissions to views by the view name and the view mode, ie. full permissions to the USER object would be a group that has set rights to /[organisation id]/_OPERATIONS/USER/[edit || view || delete || list]
#####3.1.4 object - a list or single instance of a JSON schema, instance based thing, so kind of grouped under view.
  - objects are essentially the resultsets of a view
#####3.1.5 report - a group of views arranged in a report structure, either tabular or with graphs or both. Reports are grouped under a warehouse.
  - report base page is a grid, views are dragged and dropped on to the report page.
  - when a view is dropped, the views filters appear on the top of the report page.
  - the view is then configured to display its result set in tabular or chart form.
  - reports can be saved as an image.
  - the system dashboard will eventually just be a report.

####4.1 Cluster breakdown:

#####4.1.1 cluster - container for the actual physical cluster, whcih is made up of peers
#####4.1.2 peer - peers belong to a cluster, they can be spun up to increase the cluster capacity
#####4.1.3 site - site component, able to download assemblyline projects and turn them into deployments
#####4.1.3 deployment - assembly-line project instantiation, series of components that are instances of defined assemblylines or workflows

####5.1 Assemblyline breakdown:
*The assembly line is a design area for flow driven processes, after a flow has been designed and tested, it is deployed to a site, which is a component running on the cluster that is able to download an assemblyline project and turn it into a functional process that behaves according to the flow driven design document described in the design area.*
#####5.1.1 blueprint - a template for how the default code looks for the deployment elements (droids etc.) - also contains a construct method, which is what actually builds and instantiates the deployment
#####5.1.2 project - an instantiation of a blueprint, with controls, directives, droids, deployments and assemblylines
#####5.1.3 assemblyline - a workflow of linked droids that run like an actual deployment production line, assembly lines have floors/levels and each floor has 64 sectors - so 8 x 8 grid, when zooming out the sector looks like a chip
#####5.1.4 droid - a composite element made up of a directive (back-end code) and controls (front end config)
#####5.1.5 control - front-end html for configuring a droid
#####5.1.6 directive - back-end code that the droid uses to perform its mandate
#####5.1.7 component - in the back-end, actually just a node dependency, injected into the directive's $assemblyline.components object.
#####5.1.8 system droids - the system will come with some predefined droids, such as a Scheduler (starts a flow at a scheduled time) , Valve (all, one at a time, first, last, all), Event (starts a flow based on a system event), Data Mapper (maps one data object into another, takes input and output schemas), Script (runs a piece of javascript), Power Switch (stop, pause, start) , Log (writes to the flow log), Personnel (puts flow into the hands of a user or group), Notify (email, SMS, twitter)

##Data layout
- The data is laid out according to an organisational structure
- all data items belong to an organisation, all organisations apart from the primary organisation have a parent as well. 
- If a group has a permission set in an organisation, it will by default have the same permissions for all organisations that are descendants of the organisation. 
  - this is done every time a permission is saved for the group, the ui allows for the appending of the permission down the organisation tree 
- All sessions are run from an organisation, the user logs in and then selects which organisation they want to work in.
- Users and groups are created, and mapped to the organisation they were created in.
- All objects exist under an organisation, so if a user is created in Organisation A, the user data is stored under /happner/_data/[Organisation A id]/User/[user id]
- If user A logs in and works under Organisation B, and saves a new AssemblyLine object, the object is stored under the path /happner/_data/[Organisation B id]/AssemblyLine/[assemblyline id]
