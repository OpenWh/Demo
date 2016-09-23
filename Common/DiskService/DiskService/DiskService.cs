using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;

namespace DiskService
{
    public partial class DiskService : ServiceBase
    {
        private static DriverWatcher _driverWacher = new DriverWatcher();
        public DiskService()
        {
            InitializeComponent();
            _driverWacher.DriveInserted += _driverWacher_DriveInserted;
            _driverWacher.DriveRemoved += _driverWacher_DriveRemoved;
        }

        private void _driverWacher_DriveRemoved(object sender, DriverWatcher.DriveEventArgs e)
        {
            Task.Run(() =>
            {
                using (System.IO.StreamWriter sw = new System.IO.StreamWriter("D:\\log.txt", true))
                {
                    sw.WriteLine(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss ") + "Insert.");
                }
            });
        }

        private void _driverWacher_DriveInserted(object sender, DriverWatcher.DriveEventArgs e)
        {
            Task.Run(() =>
            {
                using (System.IO.StreamWriter sw = new System.IO.StreamWriter("D:\\log.txt", true))
                {
                    sw.WriteLine(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss ") + "Remove.");
                }
            });
        }

        protected override void OnStart(string[] args)
        {
            _driverWacher.Start();
            using (System.IO.StreamWriter sw = new System.IO.StreamWriter("D:\\log.txt", true))
            {
                sw.WriteLine(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss ") + "Start.");
            }
        }

        protected override void OnStop()
        {
            _driverWacher.Stop();
            using (System.IO.StreamWriter sw = new System.IO.StreamWriter("D:\\log.txt", true))
            {
                sw.WriteLine(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss ") + "Stop.");
            }
        }
    }
}
