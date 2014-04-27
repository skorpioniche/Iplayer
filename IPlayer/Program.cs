using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace IntellectualPlayer
{
    class Program
    {
        /// <summary>
        /// This is a launcher that starts main executable in the new shadow copy enabled AppDomain. 
        /// Shadow copy is configured with default settings.
        /// </summary>
        /// <param name="args"></param>
        [LoaderOptimization(LoaderOptimization.MultiDomainHost)]
        [STAThread]
        private static void Main(string[] args)
        {
            string StartupPath = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);

            string ConfigFile = Path.Combine(StartupPath, "IntellectualPlayer.UI.exe.config");
            string Assembly = Path.Combine(StartupPath, "IntellectualPlayer.UI.exe");

            AppDomainSetup DomainSetup = new AppDomainSetup
                                             {
                                                 ApplicationName = "IntellectualPlayer.UI",
                                                 ShadowCopyFiles = "true",
                                                 ConfigurationFile = ConfigFile
                                             };

            AppDomain Domain = AppDomain.CreateDomain("Holo", AppDomain.CurrentDomain.Evidence, DomainSetup);

            Domain.ExecuteAssembly(Assembly);

            AppDomain.Unload(Domain);
        }
    }
}
