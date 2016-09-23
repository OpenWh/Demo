namespace DiskService
{
    partial class ProjectInstaller
    {
        /// <summary>
        /// 必需的设计器变量。
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary> 
        /// 清理所有正在使用的资源。
        /// </summary>
        /// <param name="disposing">如果应释放托管资源，为 true；否则为 false。</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region 组件设计器生成的代码

        /// <summary>
        /// 设计器支持所需的方法 - 不要修改
        /// 使用代码编辑器修改此方法的内容。
        /// </summary>
        private void InitializeComponent()
        {
            this.Vast3serviceProcessInstaller = new System.ServiceProcess.ServiceProcessInstaller();
            this.Vast3serviceInstaller = new System.ServiceProcess.ServiceInstaller();
            // 
            // Vast3serviceProcessInstaller
            // 
            this.Vast3serviceProcessInstaller.Account = System.ServiceProcess.ServiceAccount.LocalSystem;
            this.Vast3serviceProcessInstaller.Password = null;
            this.Vast3serviceProcessInstaller.Username = null;
            // 
            // Vast3serviceInstaller
            // 
            this.Vast3serviceInstaller.ServiceName = "DiskService";
            this.Vast3serviceInstaller.StartType = System.ServiceProcess.ServiceStartMode.Automatic;
            // 
            // ProjectInstaller
            // 
            this.Installers.AddRange(new System.Configuration.Install.Installer[] {
            this.Vast3serviceProcessInstaller,
            this.Vast3serviceInstaller});

        }

        #endregion

        private System.ServiceProcess.ServiceProcessInstaller Vast3serviceProcessInstaller;
        private System.ServiceProcess.ServiceInstaller Vast3serviceInstaller;
    }
}