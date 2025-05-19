
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import DashboardStats from '@/components/DashboardStats';
import PetCard from '@/components/PetCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardStats, mockPets } from '@/lib/mockData';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = localStorage.getItem('isAuth') === 'true';
    if (!isAuth) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
        
        <DashboardStats />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Today's scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3].map(index => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-vet-light flex items-center justify-center">
                        <span className="text-sm font-bold text-vet-blue">
                          {10 + index}:00
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{mockPets[index - 1].name}</p>
                        <p className="text-xs text-muted-foreground">{mockPets[index - 1].ownerName}</p>
                      </div>
                    </div>
                    <div className="rounded-full px-2 py-1 text-xs bg-vet-light text-vet-teal font-medium">
                      Check-up
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions in the clinic</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardStats.recentActivityLog.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-vet-blue" />
                    <div className="flex-1">
                      <p className="text-sm">{activity.action}</p>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Patients</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockPets.slice(0, 4).map(pet => (
              <PetCard key={pet.id} pet={pet} showQR={false} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
