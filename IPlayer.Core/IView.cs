using System;
using System.Collections.Generic;
using System.Text;

namespace IntellectualPlayer.Core
{
    public interface IView
    {
        void ShowError(Exception e);

        void UpdateAddedCountLabel(int count);

        void DisplayItems();
    }
}
