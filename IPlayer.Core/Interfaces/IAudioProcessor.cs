using System;
using System.Collections.Generic;
using System.ComponentModel;
using HoloDB;

namespace IntellectualPlayer.Core
{
    public interface IAudioProcessor
    {
        event EventHandler<ProgressChangedEventArgs> Progress;
        void Process(IList<Audio> list);
    }
}