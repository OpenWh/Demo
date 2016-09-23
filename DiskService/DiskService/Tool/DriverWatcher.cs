using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Management;

namespace DiskService
{
    public class DriverWatcher
    {
        ManagementEventWatcher eventWatcher;
        ManagementEventWatcher delEventWatcher;

        public void Start()
        {
            try
            {
                //DriveType
                //Value        Meaning 
                //0        Unknown
                //1        No Root Directory
                //2        Removable Disk
                //3        Local Disk
                //4        Network Drive
                //5        Compact Disc
                //6        RAM Disk
                WqlEventQuery query = new WqlEventQuery("__InstanceCreationEvent", new TimeSpan(0, 0, 1), @"TargetInstance ISA 'Win32_LogicalDisk'");

                ConnectionOptions opt = new ConnectionOptions();
                opt.EnablePrivileges = true;
                opt.Authority = null;
                opt.Authentication = AuthenticationLevel.Default;

                ManagementScope scope = new ManagementScope("\\root\\CIMV2", opt);

                eventWatcher = new ManagementEventWatcher(scope, query);
                eventWatcher.EventArrived += new EventArrivedEventHandler(eventWatcher_EventArrived);
                eventWatcher.Start();

                WqlEventQuery delQuery = new WqlEventQuery("__InstanceDeletionEvent", new TimeSpan(0, 0, 1), @"TargetInstance ISA 'Win32_LogicalDisk'");

                ConnectionOptions opt2 = new ConnectionOptions();
                opt2.EnablePrivileges = true;
                opt2.Authority = null;
                opt2.Authentication = AuthenticationLevel.Default;

                ManagementScope scope2 = new ManagementScope("\\root\\CIMV2", opt2);

                delEventWatcher = new ManagementEventWatcher(scope2, delQuery);
                delEventWatcher.EventArrived += new EventArrivedEventHandler(delEventWatcher_EventArrived);
                delEventWatcher.Start();
            }
            catch (Exception ex)
            {
            }
        }

        public void Stop()
        {
            if (eventWatcher != null)
            {
                eventWatcher.Stop();
                delEventWatcher.Stop();
            }
        }

        void eventWatcher_EventArrived(object sender, EventArrivedEventArgs e)
        {
            ManagementBaseObject wmiDevice = (ManagementBaseObject)e.NewEvent["TargetInstance"];
            string driveName = (string)wmiDevice["DeviceID"];
            string volumeName = wmiDevice.Properties["VolumeName"].Value == null ? "" : wmiDevice.Properties["VolumeName"].Value.ToString();
            if (!string.IsNullOrEmpty(driveName))
            {
                OnDriveInserted(new DriveEventArgs() { DriveName = driveName });
            }
        }

        void delEventWatcher_EventArrived(object sender, EventArrivedEventArgs e)
        {
            ManagementBaseObject wmiDevice = (ManagementBaseObject)e.NewEvent["TargetInstance"];
            string driveName = (string)wmiDevice["DeviceID"];
            string volumeName = wmiDevice.Properties["VolumeName"].Value == null ? "" : wmiDevice.Properties["VolumeName"].Value.ToString();
            if (!string.IsNullOrEmpty(driveName))
            {
                OnDriveRemoved(new DriveEventArgs() { DriveName = driveName });
            }
        }

        public event EventHandler<DriveEventArgs> DriveInserted;
        public event EventHandler<DriveEventArgs> DriveRemoved;

        protected void OnDriveInserted(DriveEventArgs e)
        {
            if (DriveInserted != null)
            {
                DriveInserted(this, e);
            }
        }

        protected void OnDriveRemoved(DriveEventArgs e)
        {
            if (DriveRemoved != null)
            {
                DriveRemoved(this, e);
            }
        }

        public class DriveEventArgs : EventArgs
        {
            public string DriveName { get; set; }
        }
    }
}
