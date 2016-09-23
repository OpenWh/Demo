using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace WinIOBeep
{
    class Program
    {
        [DllImport("WinIo64.dll")]
        public static extern bool InitializeWinIo();
        [DllImport("WinIo64.dll")]
        public static extern bool GetPortVal(IntPtr wPortAddr, out int pdwPortVal, byte bSize);
        [DllImport("WinIo64.dll")]
        public static extern bool SetPortVal(uint wPortAddr, IntPtr dwPortVal, byte bSize);
        [DllImport("WinIo64.dll")]
        public static extern void ShutdownWinIo();


        private static int TIMER_FREQUENCY = 1193167;           //; 1,193,167 Hz
        private static int OCTAVE = 2;

        //int PITCH_A		440				//;  440,00 Hz
        //int PITCH_As		446				//;  466,16 Hz
        //int PITCH_H		494				//;  493,88 Hz
        private static int PITCH_C = 523;               //;  523,25 Hz
        private static int PITCH_Cs = 554;           //;  554,37 Hz
        private static int PITCH_D = 587;           //;  587,33 Hz
        private static int PITCH_Ds = 622;       //;  622,25 Hz
        private static int PITCH_E = 659;           //;  659,25 Hz
        private static int PITCH_F = 698;           //;  698,46 Hz
        private static int PITCH_Fs = 740;       //;  739,99 Hz
        private static int PITCH_G = 784;           //;  783,99 Hz
        private static int PITCH_Gs = 831;       //;  830,61 Hz
        private static int PITCH_A = 880;           //;  880,00 Hz
        private static int PITCH_As = 988;           //;  987,77 Hz
        private static int PITCH_H = 1047;          //; 1046,50 Hz

        private static int TONE_1 = (TIMER_FREQUENCY / (PITCH_C * OCTAVE));
        private static int TONE_2 = (TIMER_FREQUENCY / (PITCH_E * OCTAVE));
        private static int TONE_3 = (PITCH_G * OCTAVE);

        static void Main(string[] args)
        {
            bool Result = InitializeWinIo();

            if (!Result)
            {
                Environment.Exit(1);
            }

            for (int i = 0; i < 5; i++)
            {
                //Beep(PITCH_A * 3);
                //Beep(PITCH_C * 3);
                //Beep(PITCH_D * 8);
                Beep(PITCH_E * 3);
                //Beep(PITCH_F * i);
                //Beep(PITCH_G * i);
                //Beep(PITCH_H * i);
            }

            ShutdownWinIo();
        }


        private static void Beep(int pitch)
        {
            int data = 0;
            //Timer 8253-5 (AT: 8254.2).
            unsafe
            {
                data = 0xb6;
                SetPortVal(0x43, new IntPtr(data), 1);

                data = pitch & 0xff;

                SetPortVal(0x42, new IntPtr(data), 1);

                data = (pitch >> 8) & 0xff;
                SetPortVal(0x42, new IntPtr(data), 1);

                //speaker on
                GetPortVal(new IntPtr(0x61),out data, 1);
                data |= 0x03;
                SetPortVal(0x61, new IntPtr(data), 1);

                Thread.Sleep(500);

                //speaker off
                GetPortVal(new IntPtr(0x61),out data, 1);
                data &= 0xFC;
                SetPortVal(0x61, new IntPtr(data), 1);
            }
        }
    }
}
