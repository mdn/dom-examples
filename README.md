to-do-notifications
===================

This is an Enhanced version of my basic to-do app, which stores to-do items via IndexedDB, and then also aims to provide notifications when to-do item deadlines are up, via the Notification, Alarm and Vibration APIs.

At the moment I have taken it as far as I have got the time to take it. The Indexed DB, Notification and Vibration functionality all works on Firefox desktop, Firefox Android, and Firefox OS.

It sort of works on Chrome too. The app largely works on Chrome, but there is a weird bug whereby when you submit a to-do task, it is stored in the database fine, but then it won't display that item in the items display list until you either refresh the page or submit another item. I've not been able to get to the bottom of this yet.

The alarm stuff is tricky. the alarms seem to work ok on Firefox OS, but not on Firefox desktop or Android because mozAlarms doesn't seem to be support yet there, plus to work the Alarm API needs to be registered in the permission section of the manifest file. This is a bit trick and annoying because if it isn't, it is given a value of null so the code fails. To get round this I had to do some feature detection.

This is all going to be written up on https://developer.mozilla.org/en-US/Apps/Developing/Control_the_display

To do:

1. Fix aforementioned Chrome bug
2. Improve icon, as it currently sucks
3. Improve form entry sanitisation, for example the task title really needs to be escaped so it is less easy to break the code with entries including apostrophes, etc.
4. Include some way to highlight tasks that are overdue in the task list
5. ...?


